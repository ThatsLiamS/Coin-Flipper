/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const achievementAdd = require('./../../util/achievementAdd');

module.exports = {
	name: 'bet',
	description: 'Bet cents on a coinflip!',
	usage: '`/bet <side> <amount>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Bets cents on a coinflip!')

		.addStringOption(option => option
			.setName('side')
			.setDescription('Heads or tails!')
			.setRequired(true)

			.addChoices({ 'name': 'heads', 'value': 'heads' }, { 'name': 'tails', 'value': 'tails'}),
		)
		.addIntegerOption(option => option
			.setName('amount')
			.setDescription('How much are you betting?')
			.setRequired(true)

			.setMaxValue(1_000_000)
			.setMinValue(50),
		),

	error: false,

	/**
	 * Bet cents on a coin flip.
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 * 
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		const bet = interaction.options.getString('side');
		let amount = Number(interaction.options.getInteger('amount'));

		/* Can they afford the bet? */
		if (amount > userData.currencies.cents) {
			interaction.followUp({ content: 'You can not afford this bet.' });
			return;
		}

		const boolean = Math.floor(Math.random() * 100) > 65;
		const embed = new EmbedBuilder()
			.setColor('Orange');

		/* Did they win? */
		if (boolean == true) {
			if (userData.evil == true) amount = Math.floor(amount * 0.75);

			userData.currencies.cents = Number(userData.currencies.cents) + Number(amount);
			embed.setDescription('You won ' + amount + ' cents!')
				.setTitle('The coin landed on ' + bet + '!');

		}
		else {
			/* Did they lose everything? */
			if (amount == userData.currencies.cents) userData = await achievementAdd(userData, 'justMyLuck');

			/* Remove the money from their account */
			userData.currencies.cents = Number(userData.currencies.cents) - Number(amount);
			embed.setDescription('You lost ' + amount + ' cents!')
				.setTitle('The coin landed on ' + (bet == 'heads' ? 'tails!' : 'heads!'));

		}

		await firestore.doc(`/users/${interaction.user.id}`).set(userData);
		
		
		/* Returns true to enable the cooldown */
		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
