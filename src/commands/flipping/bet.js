/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { achievementAdd, database } = require('./../../util/functions.js');

module.exports = {
	name: 'bet',
	description: 'Bet cents on a coinflip!',
	usage: '/bet <side> <amount>',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 30, text: '30 Seconds' },

	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Bets cents on a coinflip!')
		.setDMPermission(true)

		.addStringOption(option => option
			.setName('side').setDescription('Heads or tails!').setRequired(true)
			.addChoices({ 'name': 'heads', 'value': 'heads' }, { 'name': 'tails', 'value': 'tails' }),
		)
		.addIntegerOption(option => option
			.setName('amount').setDescription('How much are you betting?').setRequired(true)
			.setMaxValue(1_000_000).setMinValue(50),
		),

	error: false,
	defer: true,

	/**
	 * Bet cents on a coin flip.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Fetch the user's data */
		const userData = await database.getValue('user', interaction.user.id);

		const bet = interaction.options.getString('side');
		let amount = Number(interaction.options.getInteger('amount'));

		/* Can they afford the bet? */
		if (amount > userData.stats.balance) {
			interaction.followUp({ content: 'You can not afford this bet.' });
			return;
		}

		const boolean = Math.floor(Math.random() * 100) > 65;
		const embed = new EmbedBuilder()
			.setColor('Orange');

		/* Did they win? */
		if (boolean == true) {
			if (userData.settings.evil == true) amount = Math.floor(amount * 0.75);

			userData.stats.balance = Number(userData.stats.balance) + Number(amount);
			userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(amount);

			embed.setDescription('You won ' + amount + ' cents!')
				.setTitle('The coin landed on ' + bet + '!');

			await database.setValue('users', interaction.user.id, userData);

		}
		else {
			/* Remove the money from their account */
			userData.stats.balance = Number(userData.stats.balance) - Number(amount);
			embed.setDescription('You lost ' + amount + ' cents!')
				.setTitle('The coin landed on ' + (bet == 'heads' ? 'tails!' : 'heads!'));

			await database.setValue('users', interaction.user.id, (userData.stats.balance == 0 ? achievementAdd(userData, 'justMyLuck') : userData));

		}

		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
