/* Import required modules and files */
const { SlashCommandBuilder } = require('discord.js');
const { database } = require('./../../util/functions.js');

module.exports = {
	name: 'weekly',
	description: 'Claim your weekly donator cents!',
	usage: '/weekly',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 0, text: '1 Week' },

	data: new SlashCommandBuilder()
		.setName('weekly')
		.setDescription('Claim your weekly donator cents!')
		.setDMPermission(true),

	error: false,
	defer: true,

	/**
	 * Claim your weekly donator cents.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		/* Are they a donator? */
		if (userData.stats.donator == 0) {
			interaction.followUp({ content: 'You must be a donator to use this command!' });
			return false;
		}

		/* How much do they get? */
		const amt = userData.stats.donator == 1 ? 25_000 : 75_000;

		/* Get the date */
		const dateConstruct = {
			now: new Date(),
			firstOfJan: new Date((new Date()).getFullYear(), 0, 1),
		};
		const daysPassed = (((dateConstruct.now.getTime() - dateConstruct.firstOfJan.getTime()) / 86400000) + dateConstruct.firstOfJan.getDay() + 1);
		const weeksPassed = Math.ceil(daysPassed / 7);

		const today = `${weeksPassed}|${dateConstruct.now.getFullYear()}`;
		if (userData.cooldowns.weekly == today) {
			interaction.followUp({ content: 'You can only claim your weekly reward once per week! You can claim it on Sunday.' });
			return false;
		}
		userData.cooldowns.weekly = today;

		/* Add the values to the database */
		userData.stats.balance = Number(userData.stats.balance) + Number(amt);
		userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(amt);

		interaction.followUp({ content: `You claimed your weekly ${amt} cents! Thanks for donating to Coin Flipper!` });
		await database.setValue('users', interaction.user.id, userData);

		/* Returns true */
		return true;

	},
};
