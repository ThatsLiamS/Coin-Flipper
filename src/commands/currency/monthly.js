const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'monthly',
	description: 'Claim your monthly cents!',
	usage: '`/monthly`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('monthly')
		.setDescription('Claim your monthly cents!'),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const date = new Date();
		const thisMonth = date.getMonth();

		if (userData.inv.calendar < 1) {
			interaction.followUp({ content: 'You need a calendar to use this command!' });
			return false;
		}
		if (thisMonth == userData.cooldowns.monthly) {
			interaction.followUp({ content: 'You can only claim your reward once a month!' });
			return false;
		}

		let monthAmt = 20000;
		if (userData.donator > 0) monthAmt = 25000;

		userData.currencies.cents = Number(userData.currencies.cents) + Number(monthAmt);
		userData.cooldowns.monthly = thisMonth;
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		interaction.followUp({ content: `You claimed your monthly \`${monthAmt}\` cents!` });
		return true;

	},
};