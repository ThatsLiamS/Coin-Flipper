/* Import required modules and files */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'weekly',
	description: 'Claim your weekly donator cents!',
	usage: '`/weekly`',

	permissions: [],
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('weekly')
		.setDescription('Claim your weekly donator cents!')
		.setDMPermission(true),

	error: false,
	defer: true,
	cooldown: { time: 0, text: '1 Week' },

	/**
	 * Claim your weekly donator cents.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Are they a donator? */
		if (userData.donator == 0) {
			interaction.followUp({ content: 'You must be a donator to use this command!' });
			return false;
		}

		/* How much do they get? */
		let amt = 0;
		if (userData.donator == 1) amt = 25000;
		if (userData.donator == 2) amt = 75000;

		/* Can they use the command */
		const now = new Date();
		const onejan = new Date(now.getFullYear(), 0, 1);
		const thisWeek = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
		const lastWeek = userData.cooldowns.weekly;

		if (thisWeek == lastWeek) {
			interaction.reply({ content: 'You can only claim your weekly reward once per week! You can claim it on Sunday.' });
			return false;
		}

		/* Add the values to the database */
		userData.cooldowns.weekly = thisWeek;
		userData.currencies.cents = Number(userData.currencies.cents) + Number(amt);

		interaction.followUp({ content: `You claimed your weekly ${amt} cents! Thanks for donating to Coin Flipper!` });
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		/* Returns true */
		return true;

	},
};