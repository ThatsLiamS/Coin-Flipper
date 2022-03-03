const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const achievementAdd = require('./../../util/achievementAdd');

module.exports = {
	name: 'bet',
	description: 'Bet cents on the coinflip!',
	usage: '<side> <amount>',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Bets cents on the coinflip!')

		.addStringOption(option => option
			.setName('side')
			.setDescription('Heads or tails!')
			.setRequired(true)

			.addChoice('heads', 'heads').addChoice('tails', 'tails'),
		)
		.addIntegerOption(option => option
			.setName('amount')
			.setDescription('How much are you betting?')
			.setRequired(true)

			.setMaxValue(1_000_000)
			.setMinValue(50),
		),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const bet = interaction.options.getString('side');
		let amount = Number(interaction.options.getInteger('amount'));

		if (amount > userData.currencies.cents) {
			interaction.followUp({ content: 'You can not afford this bet.' });
			return;
		}

		const boolean = Math.floor(Math.random() * 100) > 65;
		const embed = new MessageEmbed()
			.setColor('ORANGE');

		if (boolean == true) {
			if (userData.evil == true) amount = Math.floor(amount * 0.75);

			userData.currencies.cents = Number(userData.currencies.cents) + Number(amount);
			embed.setDescription('You won ' + amount + ' cents!')
				.setTitle('The coin landed on ' + bet + '!');

		}
		else {
			if (amount == userData.currencies.cents) userData = await achievementAdd(userData, 'justMyLuck');

			userData.currencies.cents = Number(userData.currencies.cents) - Number(amount);
			embed.setDescription('You lost ' + amount + ' cents!')
				.setTitle('The coin landed on ' + bet == 'heads' ? 'tails!' : 'heads!');

		}

		interaction.followUp({ embeds: [embed] });
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

	},
};
