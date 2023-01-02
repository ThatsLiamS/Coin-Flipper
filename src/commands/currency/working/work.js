/* Import required modules and files */
const { SlashCommandBuilder } = require('discord.js');
const { achievementAdd, database } = require('./../../../util/functions.js');
const { joblist } = require('./../../../util/constants.js');

module.exports = {
	name: 'work',
	description: 'Work at your job and collect your pay cheque!',
	usage: '/work',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 60 * 60, text: '1 Hour' },

	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work at your job and collect your pay cheque!')
		.setDMPermission(true),

	error: false,
	defer: true,

	/**
	 * Work at your job and collect your pay cheque!
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord bot client
	 * @returns {boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Fetch the values from the database */
		const userData = await database.getValue('users', interaction.user.id);

		/* Do they have a job */
		if (userData.stats.job == 'none' || userData.stats.job == '') {
			interaction.followUp({ content: 'You need a job to do work! Get a job using `/job claim`' });
			return;
		}

		/* Find their job object */
		const jobFound = joblist.find(ite => ite.name.toLowerCase() == userData.stats.job);
		const work = jobFound.working;

		/* Work out the amount to pay them */
		const reason = work[Math.floor(Math.random() * work.length)];

		let randomAmt = Math.floor(Math.random() * (500 - 300 + 1)) + 400;
		if (userData.settings.evil == true) randomAmt = Math.ceil(randomAmt * 0.5);
		if (userData.items?.clipboard > 0 && userData.settings.evil == false) randomAmt = Math.ceil(randomAmt * 1.5);
		if (userData.stats.donator > 0) randomAmt = Math.ceil(randomAmt * 1.5);

		randomAmt = Math.ceil(randomAmt * jobFound.multi);

		/* Add the money to their acount */
		userData.stats.balance = Number(userData.stats.balance) + Number(randomAmt);
		userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(randomAmt);
		userData.stats.worked = Number(userData.stats.worked) + Number(1);


		interaction.followUp({ content: `You got \`${randomAmt}\` cents by ${reason}!` });

		/* Set the values in the database */
		const newData = (userData.stats.worked >= 40) ? await achievementAdd(userData, 'nineToFive', client) : userData;
		await database.setValue('users', interaction.user.id, newData);
		return true;

	},
};
