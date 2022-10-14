/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'daily',
	description: 'Claim your daily cents!',
	usage: '`/daily`',

	permissions: [],
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim your daily cents!')
		.setDMPermission(true),

	error: false,
	defer: false,

	/**
	 * Claim your daily cents.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Have they claimed it already */
		const date = new Date();
		const thisDate = date.getDate();
		const lastDate = userData?.cooldowns?.daily;
		let pass = false;

		if (userData.inv.vault > 0) {
			if (thisDate != lastDate) userData.cooldowns.claimed = 0;
			const claimed = userData.cooldowns.claimed;
			if (claimed == 0) {
				userData.cooldowns.claimed = 1;
			}
			else if (claimed == 1) {
				userData.cooldowns.claimed = 2;
				pass = true;
			}
		}

		if (thisDate == lastDate && pass == false) {
			interaction.reply({ content: 'You can only claim your reward once a day!' });
			return false;
		}

		userData.cooldowns.daily = thisDate;

		/* How much do they claim */
		let randomAmt = Math.floor(Math.random() * (6000 - 4000 + 1)) + 1000;
		if (userData.donator > 0) randomAmt = Math.ceil(randomAmt * 1.5);

		const embed = new EmbedBuilder()
			.setTitle('You claimed your daily reward!')
			.setDescription(`You got \`${randomAmt}\` cents!\nMake sure to come back tomorrow to claim your next one!`)
			.setColor('Green');

		interaction.reply({ embeds: [embed] });

		/* Set the balance in the database */
		userData.currencies.cents = Number(userData.currencies.cents) + Number(randomAmt);
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		/* Returns true */
		return true;
	},
};