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

	options: [
		{ name: 'side', description: 'Heads or tails', type: 'STRING', choices: [{ name: 'heads', value: 'heads' }, { name: 'tails', value: 'tails' }], required: true },
		{ name: 'amount', description: 'How much are you willing to bet?', type: 'INTEGER', required: true },
	],

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
