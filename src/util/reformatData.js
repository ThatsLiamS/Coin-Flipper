/**
 * This file has been created temporarily to reformat Coin Flipper's old database
 * documents into the newly designed (src/util/Database Schema.js)
 *
 * Created 31/12/2022 @ThatsLiamS <me@liamskinner.co.uk>
**/


/* Import required modules and files */
const { itemlist, badgelist, joblist } = require('./constants.js');

/**
 * Removes empty addons, changes datatype to an Array<Objects>
 * @function
 * @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {object} data - old addon Object
 * @returns {array<object>}
**/
const reformatAddons = (data) => {
	if (typeof data == Array) return data;
	const current = [data?.first, data?.second, data?.third];

	const newAddons = [];
	current.map((addon) => {
		if (addon?.name != '' && addon?.name != 'none') {
			newAddons.push({
				name: addon.name,
				description: ((typeof addon.description == 'string') && addon.description != '') ? addon.description : '',
				cost: (addon.cost != 0 && typeof addon.cost == 'number') ? addon.cost : 0,
				published: false,
				responses: (typeof addon?.responses == 'object') ? addon.responses : [],
			});
		}
	});

	return newAddons;
};

/**
 * Formats the userData into the new Schema
 * @function
 * @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {object} data - UserData from the cache/database
 * @returns {object}
**/
const reformatUser = (data) => {
	if (data?.stats?.lifeEarnings >= 0 && (typeof data?.settings == 'object')) return data;
	const newData = {};

	newData.stats = {
		flips: (typeof data?.stats?.flipped == 'number') ? data.stats.flipped : 0,
		minigames: (typeof data?.stats?.minigames_won == 'number') ? data.stats.minigames_won : 0,
		worked: (typeof data?.stats?.timesWorked == 'number') ? data.stats.timesWorked : 0,
		given: (typeof data?.giveData?.cents == 'number') ? data.giveData.cents : 0,
		job: (data?.job && (joblist.filter(i => i.id == data?.job)[0])) ? data.job : '',

		donator: (typeof data.donator == 'number') ? data.donator : 0,
		bugs: (typeof data.bugs == 'number') ? data.bugs : 0,

		balance: (typeof data.currencies.cents == 'number') ? data.currencies.cents : 0,
		bank: (typeof data.currencies.cents == 'number') ? data.currencies.cents : 0,
		lifeEarnings: Number(this.balance + this.bank) || 0,
	};

	newData.settings = {
		evil: (data?.evil == true) ? true : false,
		compact: (data?.compact == true) ? true : false,
		banned: (data?.banned == true) ? true : false,
		developer: (data?.inv?.toolbox == true) ? true : false,
	};

	newData.cooldowns = {
		daily: '',
		weekly: '',
		monthly: '',
	};
	newData.addons = reformatAddons(data.addons.customaddons);

	const sortItems = (inv) => {
		const newInv = {};
		for (const item of itemlist) { if (inv && inv[item.id] && inv[item.id] > 0) newInv[item.id] = inv[item.id]; }
		return newInv;
	};
	newData.items = sortItems(data.inv);

	const sortBadges = (inv) => {
		const newInv = {};
		for (const badge of badgelist) { if (inv && inv[badge.id] && inv[badge.id] == true) newInv[badge.id] = true; }
		return newInv;
	};
	newData.badges = sortBadges(data.badges);
	newData.achievements = (typeof data?.achievements == 'object') ? data.achievements : {};


	return newData;
};

/**
 * Formats the guildData into the new Schema
 * @function
 * @author Liam Skinner <me@liamskinner.co.uk>
 *
 * @param {object} data - GuildData from the cache/database
 * @returns {object}
**/
const reformatGuild = (data) => {
	if (data?.features) return data;

	return {
		features: {
			trash: data.enabled.trash == true ? true : false,
			minigames: data.enabled.minigames == true ? true : false,
			addons: data.enabled.customaddons == true ? true : false,
		},

		addons: reformatAddons(data.serveraddons),

		trash: {},
	};
};

module.exports = {
	users: reformatUser,
	guilds: reformatGuild,
};
