// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

const { joblist } = require('./../../../util/constants');
const { achievementAdd, database } = require('./../../../util/functions');


module.exports = {
	name: 'work',
	description: 'Work at your job and collect your pay cheque!',
	usage: '/work',

	cooldown: {
		time: 60 * 60,
		text: '1 Hour',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work at your job and collect your pay cheque!')
		.setDMPermission(true),

	/**
	 * @async @function
	 * @group Commands @subgroup Currency
	 * @summary Work - earn money
	 * 
	 * @param {Object} param
	 * @param {CommandInteraction} param.interaction - DiscordJS Slash Command Object
	 * 
	 * @returns {Promise<boolean>} True (Success) - triggers cooldown.
	 * @returns {Promise<boolean>} False (Error) - skips cooldown.
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async ({ interaction, client }) => {

		/* Fetch the values from the database */
		const userData = await database.getValue('users', interaction.user.id);

		/* Do they have a job */
		if (userData.stats.job === 'none' || userData.stats.job === '') {
			interaction.followUp({
				content: 'You need a job to do work! Get a job using `/job claim`',
			});
			return false;
		}

		/* Find their job object */
		const jobFound = joblist.find(ite => ite.name.toLowerCase() === userData.stats.job);
		const work = jobFound.working;

		/* Work out the amount to pay them */
		const reason = work[Math.floor(Math.random() * work.length)];

		let randomAmt = Math.floor(Math.random() * (500 - 300 + 1)) + 400;
		if (userData.settings.evil === true) {
			randomAmt = Math.ceil(randomAmt * 0.5);
		}
		if (userData.items?.clipboard > 0 && userData.settings.evil === false) {
			randomAmt = Math.ceil(randomAmt * 1.5);
		}
		if (userData.stats.donator > 0) {
			randomAmt = Math.ceil(randomAmt * 1.5);
		}

		randomAmt = Math.ceil(randomAmt * jobFound.multi);

		/* Add the money to their account */
		userData.stats.balance = Number(userData.stats.balance) + Number(randomAmt);
		userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(randomAmt);
		userData.stats.worked = Number(userData.stats.worked) + Number(1);


		interaction.followUp({
			content: `You got \`${randomAmt}\` cents by ${reason}!`,
		});

		/* Set the values in the database */
		const newData = (userData.stats.worked >= 40)
			? await achievementAdd(userData, 'nineToFive', client)
			: userData;

		await database.setValue('users', interaction.user.id, newData);
		return true;
	},
};
