const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'register',
	description: 'View or edit your register balance!',
	usage: '`/register balance`\n`/register withdraw <amount>`\n`/register deposit <amount>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('View or edit your register balance!')

		.addSubcommand(subcommand => subcommand
			.setName('balance')
			.setDescription('View the cents in your register!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('withdraw')
			.setDescription('Withdraw cents into your register!')
			.addIntegerOption(option => option.setName('amount').setDescription('How much would you like to withdraw?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('deposit')
			.setDescription('Deposits cents into your register!')
			.addIntegerOption(option => option.setName('amount').setDescription('How much would you like to deposit?').setRequired(true)),
		),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		if (userData.inv.key < 1) {
			interaction.followUp({ content: 'Woah, you need a key for this command!' });
			return false;
		}

		if (subCommandName == 'balance') {

			let percent = userData.donator != 0 ? (userData.donator == 1 ? 15 : 25) : 10;
			if (userData.inv.label > 0) percent += 10;
			if (userData.evil == true) percent = 7.5;

			const embed = new MessageEmbed()
				.setTitle(`${interaction.user.username}'s cash register`)
				.setColor('BLACK')
				.setDescription(`There are ${userData.currencies.register} cents in this register!\nEvery time you flip a coin, **${percent}%** of the amount goes into this register!`)
				.addFields(
					{ name: 'Useful commands', value: '`/register deposit` - Deposits cents into your register\n`/register withdraw` - Withdraw cents from your register', inline: false },
				);

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'withdraw') {

			const amount = interaction.options.getInteger('amount');
			if (amount > userData.currencies.register) {
				interaction.followUp({ content: 'You don\'t have that much in your register.' });
				return false;
			}

			userData.currencies.cents = Number(userData.currencies.cents) + amount;
			userData.currencies.register = Number(userData.currencies.register) - amount;

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			interaction.followUp({ content: `You successfully withdrew ${amount} cents.` });
			return true;
		}

		if (subCommandName == 'deposit') {

			const amount = interaction.options.getInteger('amount');
			if (amount > userData.currencies.cents) {
				interaction.followUp({ content: 'You don\'t have that much in your balance.' });
				return false;
			}

			userData.currencies.cents = Number(userData.currencies.cents) - amount;
			userData.currencies.register = Number(userData.currencies.register) + amount;

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			interaction.followUp({ content: `You successfully deposited ${amount} cents.` });
			return true;
		}

		return false;

	},
};
