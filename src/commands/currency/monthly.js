/* Import required modules and files */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'monthly',
	description: 'Claim your monthly cents!',
	usage: '`/monthly`',

	permissions: [],
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('monthly')
		.setDescription('Claim your monthly cents!')
		.setDMPermission(true),

	error: false,
	defer: false,

	/**
	 * Claim your monthly cents.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		const date = new Date();
		const thisMonth = date.getMonth();

		/* Can they use the command */
		if (userData.inv.calendar < 1) {
			interaction.reply({ content: 'You need a calendar to use this command!' });
			return false;
		}
		if (thisMonth == userData.cooldowns.monthly) {
			interaction.reply({ content: 'You can only claim your reward once a month!' });
			return false;
		}

		/* How much can they claim */
		let monthAmt = 20000;
		if (userData.donator > 0) monthAmt = 25000;

		/* Add the money to their balance */
		userData.currencies.cents = Number(userData.currencies.cents) + Number(monthAmt);
		userData.cooldowns.monthly = thisMonth;

		interaction.reply({ content: `You claimed your monthly \`${monthAmt}\` cents!` });

		/* returns true, cooldown set within the database */
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);
		return true;

	},
};