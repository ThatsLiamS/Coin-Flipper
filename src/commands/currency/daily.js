const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'daily',
	description: 'Claim your daily cents!',
	usage: '`/daily`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim your daily cents!'),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const date = new Date();
		const thisDate = date.getDate();
		const lastDate = userData.cooldowns.daily;
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
			interaction.followUp({ content: 'You can only claim your reward once a day!' });
			return false;
		}

		userData.cooldowns.daily = thisDate;

		let randomAmt = Math.floor(Math.random() * (6000 - 4000 + 1)) + 1000;
		if (userData.donator > 0) randomAmt = Math.ceil(randomAmt * 1.5);

		userData.currencies.cents = Number(userData.currencies.cents) + Number(randomAmt);
		await firestore.doc(`/users/${interaction.usr.id}`).set(userData);

		const embed = new MessageEmbed()
			.setTitle('You claimed your daily reward!')
			.setDescription(`You got \`${randomAmt}\` cents!\nMake sure to come back tomorrow to claim your next one!\nIf you want 1000 more cents, vote for the bot with \`c!vote\`!`)
			.setColor('GREEN');

		interaction.followUp({ embeds: [embed] });
		return true;
	},
};