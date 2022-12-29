/* Import required modules and files */
const { SlashCommandBuilder } = require('discord.js');
const { achievementAdd } = require('./../../../util/functions.js');
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
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Do they have a job */
		const job = userData.job;
		if (job == 'none') {
			interaction.followUp({ content: 'You need a job to do work! Get a job using `/job claim`' });
			return;
		}

		/* Find their job object */
		const jobFound = joblist.find(ite => ite.name.toLowerCase() == job);
		const work = jobFound.working;

		/* Work out the amount to pay them */
		const reason = work[Math.floor(Math.random() * work.length)];
		let randomAmt = Math.floor(Math.random() * (500 - 300 + 1)) + 400;

		if (userData.evil == true) randomAmt = Math.ceil(randomAmt * 0.5);
		if (userData.inv.clipboard > 0 && userData.evil == false) randomAmt = Math.ceil(randomAmt * 1.5);
		if (userData.donator > 0) randomAmt = Math.ceil(randomAmt * 1.5);

		randomAmt = Math.ceil(randomAmt * jobFound.multi);

		/* Add the money to their acount */
		userData.currencies.cents = Number(userData.currencies.cents) + Number(randomAmt);
		userData.stats.timesWorked = Number(userData.stats.timesWorked) + Number(1);

		if (userData.stats.timesWorked >= 40) userData = await achievementAdd(userData, 'nineToFive');
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		/* return true to enable the cooldown */
		interaction.followUp({ content: `You got \`${randomAmt}\` cents by ${reason}!` });
		return true;

	},
};