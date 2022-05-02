const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'weekly',
	description: 'Claim your weekly donator cents!',
	usage: '`/weekly`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('weekly')
		.setDescription('Claim your weekly donator cents!'),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const now = new Date();
		const onejan = new Date(now.getFullYear(), 0, 1);
		const thisWeek = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
		const lastWeek = userData.cooldowns.weekly;

		let amt = 0;

		if (userData.donator == 0) {
			interaction.followUp({ content: 'You must be a donator to use this command!' });
			return;
		}

		if (userData.donator == 1) amt = 25000;
		if (userData.donator == 2) amt = 75000;

		if (thisWeek == lastWeek) {
			interaction.followUp({ content: 'You can only claim your weekly reward once per week! You can claim it next Sunday.' });
			return;
		}
		userData.cooldowns.weekly = thisWeek;
		userData.currencies.cents = Number(userData.currencies.cents) + Number(amt);

		await firestore.doc(`/users/${interaction.user.id}`).set(userData);
		interaction.followUp({ content: `You claimed your weekly ${amt} cents! Thanks for donating to Coin Flipper!` });

	},
};