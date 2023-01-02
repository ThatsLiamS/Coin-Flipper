/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { achievementAdd, database } = require('./../../util/functions.js');
const { itemlist } = require('./../../util/constants.js');

module.exports = {
	name: 'give',
	description: 'Help out and support another user!',
	usage: '/give cents <user> <amount>\n/give item <user> <item>',

	permissions: [],
	guildOnly: true,
	cooldown: { time: 60, text: '60 Seconds' },

	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Help out and support another user!')
		.setDMPermission(false)

		.addSubcommand(subcommand => subcommand
			.setName('cents').setDescription('Give cents to another user!')

			.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
			.addIntegerOption(option => option.setName('amount').setDescription('How much would you like to give?')
				.setRequired(true).setMinValue(5).setMaxValue(50_000)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('item').setDescription('Give an item to another user!')

			.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
			.addStringOption(option => option.setName('item').setDescription('Which item to give away?').setRequired(true)),
		),

	error: false,
	defer: true,

	/**
	 * Help out and support another user.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord bot client
	 * @returns {boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Get all the users' information */
		const target = interaction.options.getUser('user');

		const userData = await database.getValue('users', interaction.user.id);
		const targetData = await database.getValue('users', target.id);

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		if (subCommandName == 'cents') {

			/* How much money to give */
			const amount = interaction.options.getInteger('amount');
			if (amount > userData.stats.balance) {
				interaction.followUp({ content: 'You don\'t have that much!' });
				return false;
			}

			/* Swap the money over */
			userData.stats.given = Number(userData.stats.given) + Number(amount);
			userData.stats.balance = Number(userData.stats.balance) - Number(amount);
			targetData.stats.balance = Number(targetData.stats.balance) + Number(amount);

			const embed = new EmbedBuilder()
				.setColor('Green')
				.setTitle('Every little helps!')
				.setDescription(`You gave <@${target.id}> **${amount}** cents!\n\nYou now have ${userData.stats.balance} and ${target.username} has ${targetData.stats.balance}.`);

			/* Return true to enable the cooldown */
			interaction.followUp({ embeds: [embed] });

			/* Set the new balances in the database */
			await database.setValue('users', interaction.user.id, (
				amount >= 10000 ? await achievementAdd(userData, 'generous', client) : (
					amount == 5 ? await achievementAdd(userData, 'ungenerous', client) : userData
				)
			));
			await database.setValue('users', target.id, targetData);
			return true;
		}

		if (subCommandName == 'item') {

			/* Locate the selected item */
			const itemName = interaction.options.getString('item');
			const item = itemlist.filter((i) => i.name == itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];

			/* Do they have that item */
			if (userData.items[item.id] < 1) {
				interaction.followUp({ content: 'You do not have that item.' });
				return false;
			}

			/* swap the items over */
			userData.items[item.id] = Number(userData.items[item.id]) - 1;

			if (item.id == 'pin') targetData.items['pingiven'] = Number(targetData.items['pingiven'] || 0) + 1;
			else targetData.items[item.id] = Number(targetData.items[item.id] || 0) + 1;

			await database.setValue('users', interaction.user.id, userData);
			await database.setValue('users', target.id, targetData);

			/* returns true to enable the cooldown */
			interaction.followUp({ content: `You gave **${target.username}** 1x ${item.prof}!` });
			return true;
		}

		return false;

	},
};
