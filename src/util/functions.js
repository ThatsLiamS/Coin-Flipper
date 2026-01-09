// eslint-disable-next-line no-unused-vars
const { Collection, Client } = require('discord.js');
const firebaseAdmin = require('firebase-admin');

const { achievements, itemlist } = require('./constants');
const { GuildSchema, UserSchema } = require('./Database Schema');


/* Connection to the Firestore Database */
firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert(
		JSON.parse(process.env['Database']),
	),
});
const firestore = firebaseAdmin.firestore();


/* Create the Database's cache */
const cache = {
	guilds: new Collection(),
	users: new Collection(),
};
const database = {

	/**
	 * @async @function
	 * @group Utility
	 * @summary Database management - read
	 * 
	 * @param {String} collectionID
	 * @param {String} documentID
	 * 
	 * @returns {Promise<Object>} Database object
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	getValue: async (collectionID, documentID) => {

		/* Is the data in the cache? */
		const cacheData = cache[collectionID].get(documentID);
		if (cacheData) {
			return cacheData;
		}

		/* Fetch the data from Firestore */
		const collection = await firestore
			.collection(collectionID)
			.doc(documentID)
			.get();
		const firestoreData = collection.data() || (collectionID === 'users' ? UserSchema : GuildSchema);

		/* Set the values in the cache */
		cache[collectionID].set(documentID, firestoreData);
		return firestoreData;
	},

	/**
	 * @async @function
	 * @group Utility
	 * @summary Database management - set
	 * 
	 * @param {String} collectionID
	 * @param {String} documentID
	 * @param {Object} data
	 * 
	 * @returns {Promise<boolean>} True (Success)
	 * @returns {Promise<boolean>} False (Error)
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	setValue: async (collectionID, documentID, data) => {

		/* Update the cache */
		cache[collectionID].delete(documentID);
		cache[collectionID].set(documentID, data);

		/* Update the database */
		await firestore
			.collection(collectionID)
			.doc(documentID)
			.set(data);
		return true;
	},
};


/**
 * @function
 * @group Utility
 * @summary Right-end string padding
 * 
 * @param {String} str
 * @param {Integer} length
 * 
 * @returns {String}
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
**/
const fitString = (str, length) => (str + ' '.repeat(length - str.length));

/**
 * @function
 * @group Utility
 * @summary Database management - set
 * 
 * @param {Integer[][]} results
 * 
 * @returns {String} Correctly formatted results grid
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
**/
const makeGrid = (results) => {
	const rows = [];

	for (let y = 0; y < results[0].length; y++) {
		const values = [y + 1];

		for (let x = 0; x < 3; x++) {
			if (x === 0) {
				const num = results[x][y].toString();
				values.push(`${num.length === 2 ? 0 + num.toString() : num.toString()} ms  `);
			}
			else {
				values.push(fitString(results[x][y].toString(), [8, 7, 7][x]));
			}
		}
		rows[y] = `| ${values[0]}  |  ${values[1]}|   ${values[2]}|  ${values[3]}|`;
	}

	const border = '+----+----------+----------+---------+';
	const title = '| ID |   PING   | SERVERS  |  USERS  |';

	return [border, title, border].concat(rows).concat(border).join('\n');
};


/**
 * @function
 * @group Utility
 * @summary Convert seconds into highest denomination
 * 
 * @param {Integer} seconds
 * 
 * @returns {String}
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
**/
const formatTime = (seconds) => {

	const denominations = [
		[1, 'Second'],
		[60, 'Minute'],
		[60 * 60, 'Hour'],
	];

	const getDenominationType = (seconds) => {
		if (seconds < 61) { return 0; }
		if (seconds < 3600) { return 1; }
		return 2;
	};
	const type = getDenominationType(seconds);
	const num = Math.floor(seconds / denominations[type][0]);

	return `${num} ${denominations[type][1]}${num !== 1 ? 's' : ''}`;
};


/**
 * @function
 * @group Utility
 * @summary Awards achievements
 * 
 * @param {Object} userData
 * @param {String} prop
 * @param {Client} client DiscordJS Bot Client Object
 * 
 * @returns {String}
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
**/
const achievementAdd = async (userData, prop, client) => {

	/* Does the achievement ex */
	const achievement = achievements
		.find(a => a.id === prop);

	if (!achievement) {
		return userData;
	}

	userData?.achievements ? userData.achievements : {};
	if (!userData.achievements[prop]) {

		/* Add the achievement */
		userData.achievements[prop] = true;

		/* send them a notification */
		const user = await client?.users
			.fetch(userData.id)
			.catch();
	
		user?.send({
			content: `**Notification**\nYou got the achievement ${achievement.emoji} ${achievement.name}!`,
		}).catch();
	}

	return userData;
};

/**
 * @function
 * @group Utility
 * @summary Checks item-related achievement requirement 
 * 
 * @param {Object} userData
 * @param {Client} client DiscordJS Bot Client Object
 * 
 * @returns {String}
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
**/
const gotItem = async (userData, client) => {

	let passed = true;
	for (const item of itemlist) {
		if ((userData.items[item.id] || 0) < 1) {
			passed = false;
		}
	}

	return passed
		? await achievementAdd(userData, 'trueCollector', client)
		: userData;
};


module.exports = {
	database,
	achievementAdd,
	gotItem,
	fitString,
	makeGrid,
	formatTime,
};
