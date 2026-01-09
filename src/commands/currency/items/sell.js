// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, SlashCommandBuilder, CommandInteraction } = require('discord.js');

const { itemlist } = require('./../../../util/constants');
const { database } = require('./../../../util/functions');


module.exports = {
	name: 'sell',
	description: 'Sell an item to the shop!',
	usage: '/sell <item>',

	cooldown: {
		time: 10,
		text: '10 Seconds',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell an item to the shop!')
		.setDMPermission(true)

		.addStringOption(option => option
			.setName('item')
			.setDescription('Which item would you like to sell:')
			.setRequired(true),
		),

	/**
	 * @async @function
	 * @group Commands @subgroup Currency
	 * @summary Item management - sell
	 * 
	 * @param {Object} param
	 * @param {CommandInteraction} param.interaction - DiscordJS Slash Command Object
	 * 
	 * @returns {Promise<boolean>} True (Success) - triggers cooldown.
	 * @returns {Promise<boolean>} False (Error) - skips cooldown.
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async ({ interaction }) => {

		/* Locate the selected item */
		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.name === itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];

		/* Can you sell it? */
		if (!item) {
			interaction.followUp({
				content: 'That is not a valid item to sell.',
			});
			return false;
		}

		/* Fetch values from the database */
		const userData = await database.getValue('users', interaction.user.id);

		if ((userData?.items[item.id] || 0) < 1) {
			interaction.followUp({
				content: 'You don\'t have that item to sell.',
			});
			return false;
		}

		/* How much for? */
		const price = item.sell
			? item.sell
			: Math.ceil(item.cost / 2);

		userData.stats.balance = Number(userData.stats.balance) + price;
		userData.items[item.id] = Number(userData.items[item.id]) - Number(1);

		const embed = new EmbedBuilder()
			.setTitle(`Congrats, ${interaction.user.username}!`)
			.setDescription(`You sold 1 ${item.prof} for **${price}** cents!`)
			.setColor('Green');

		interaction.followUp({
			embeds: [embed],
		});

		/* Set the new values in the database */
		await database.setValue('users', interaction.user.id, userData);
		return true;
	},
};
