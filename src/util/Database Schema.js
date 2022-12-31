const AddonSchema = {
	name: '', description: '', cost: 0,
	published: false, responses: [],
};


const UserSchema = {

	stats: {
		flips: 0,
		minigames: 0,
		worked: 0,
		job: '',

		donator: 0,
		balance: 0,
		bank: 0,
		lifeEarnings: 0,
	},

	settings: {
		evil: false,
		compact: false,
		banned: false,
		developer: false,
	},

	cooldowns: {
		daily: '',
		weekly: '',
		monthly: '',
	},

	addons: [
		/**
		 * @example [AddonSchema, AddonSchema, AddonSchema]
		**/
	],

	items: {},
	badges: {},
	achievements: {},

};

const GuildSchema = {

	features: {
		trash: true,
		minigames: true,
		addons: true,
	},

	addons: [
		/**
		 * @example [AddonSchema, AddonSchema, AddonSchema]
		**/
	],

};


module.exports = {
	AddonSchema,
	UserSchema,
	GuildSchema,
};
