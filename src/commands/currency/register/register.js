/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { database } = require('./../../../util/functions.js');

module.exports = {
	name: 'register',
	description: 'View or edit your register balance!',
	usage: '/register balance\n/register withdraw <amount>\n/register deposit <amount>',

	cooldown: { time: 15, text: '15 Seconds' },
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('View or edit your register balance!')
		.setDMPermission(true)

		.addSubcommand(subcommand => subcommand
			.setName('balance').setDescription('View the cents in your register!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('withdraw').setDescription('Withdraw cents into your register!')
			.addIntegerOption(option => option.setName('amount').setDescription('How much would you like to withdraw?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('deposit').setDescription('Deposits cents into your register!')
			.addIntegerOption(option => option.setName('amount').setDescription('How much would you like to deposit?').setRequired(true)),
		),

	/**
	 * View or edit your register balance.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Fetch values from the database */
		const userData = await database.getValue('users', interaction.user.id);

		/* Can they use this command? */
		if (!userData?.items?.key || userData.items.key < 1) {
			interaction.followUp({ content: 'Woah, you need a key for this command!' });
			return false;
		}

		/* Subcommand specific code */
		if (subCommandName == 'balance') {

			/* Work out flip percentage */
			let percent = userData.stats.donator > 0 ? (userData.stats.donator == 1 ? 15 : 25) : 10;
			if (userData.items.label && userData.items.label > 0) percent += 10;
			if (userData.settings.evil == true) percent = 7.5;

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s cash register`)
				.setColor('Black')
				.setDescription(`There are ${userData.stats.bank} cents in this register!\nEvery time you flip a coin, **${percent}%** of the amount goes into this register!`)
				.addFields(
					{ name: 'Useful commands', value: '`/register deposit` - Deposits cents into your register\n`/register withdraw` - Withdraw cents from your register', inline: false },
				);

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'withdraw') {

			/* How much to withdraw? */
			const amount = interaction.options.getInteger('amount');
			if (amount > userData.stats.bank) {
				interaction.followUp({ content: 'You don\'t have that much in your register.' });
				return false;
			}

			userData.stats.balance = Number(userData.stats.balance) + amount;
			userData.stats.bank = Number(userData.stats.bank) - amount;

			interaction.followUp({ content: `You successfully withdrew ${amount} cents.` });
		}

		if (subCommandName == 'deposit') {

			/* How much to deposit? */
			const amount = interaction.options.getInteger('amount');
			if (amount > userData.stats.balance) {
				interaction.followUp({ content: 'You don\'t have that much in your balance.' });
				return false;
			}

			userData.stats.balance = Number(userData.stats.balance) - amount;
			userData.stats.bank = Number(userData.stats.bank) + amount;

			interaction.followUp({ content: `You successfully deposited ${amount} cents.` });
		}

		/* Set the values in the database */
		await database.setValue('users', interaction.user.id, userData);
		return true;

	},
};
