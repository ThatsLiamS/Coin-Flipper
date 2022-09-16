/* Import required modules and files */
const { achievements, itemlist } = require('./constants');


/* Runs when the user gets a new achievement */
const achievementAdd = (userData, prop) => {

	/* Does the achivement ex */
	const achievement = achievements.find(a => a.id == prop);
	if (!achievement) return userData;

	userData?.achievements ? userData.achievements : {};
	if (!userData.achievements[prop]) {

		/* Add the achievement */
		userData.achievements[prop] = true;

		/* send them a notification */
		const mail = userData?.newMail ? userData.newMail : [];
		mail.push(`**Notification**\nYou got the achievement ${achievement.emoji} ${achievement.name}!`);
		userData.newMail = mail;
	}

	return userData;
};


/* Runs when a user gets a new item */
const gotItem = (userData) => {

	for (const item of itemlist) {
		if (userData.inv[item.id] < 1) {
			userData = achievementAdd(userData, 'trueCollector');
		}
	}

	return userData;
};


/* Formats the 'about command' information into a cool grid */
const fitString = (str, length) => str + ' '.repeat(length -= str.length);
const makeGrid = (results) => {

	const border = '+----+----------+----------+---------+';
	const rows = [];

	/* Create rows for each shard */
	for (let y = 0; y < results[0].length; y++) {
		const values = [y + 1];

		for (let x = 0; x < 3; x++) {
			if (x == '0') {
				let num = results[x][y].toString();
				if (num.length == 2) { num = 0 + num; }

				values.push(`${num} ms  `);
			}
			else { values.push(fitString(results[x][y].toString(), [8, 7, 7][x])); }
		}
		rows[y] = `| ${values[0]}  |  ${values[1]}|   ${values[2]}|  ${values[3]}|`;
	}

	/* Add all the rows together */
	let grid = `${border}\n| ID |   PING   | SERVERS  |  USERS  |\n${border}\n`;
	for (const row of rows) grid += `${row}\n`;
	grid += `${border}`;

	/* return the grid */
	return grid;
};


/* Export all functions */
module.exports = {
	achievementAdd,
	gotItem,
	fitString,
	makeGrid,
};
