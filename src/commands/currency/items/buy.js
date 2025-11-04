const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { itemlist } = require('./../../../util/constants');
const { database } = require('./../../../util/functions');


module.exports = {
	name: 'buy',
	description: 'Buy an item from the shop!',
	usage: '/buy <item>',

	cooldown: {
		time: 30,
		text: '30 Seconds',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item from the shop!')
		.setDMPermission(true)

		.addStringOption(option => option
			.setName('item')
			.setDescription('Which item would you like to buy:')
			.setRequired(true),
		),

	/**
	 * Buy an item from the shop.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Locate the selected item */
		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.name === itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];

		/* Can you get the item from the shop? */
		if (!item || item?.found !== 'shop' && item?.found !== 'market') {
			interaction.followUp({
				content: 'That is not a valid item to buy.',
			});
			return false;
		}

		/* Fetch the values from the database */
		const userData = await database.getValue('users', interaction.user.id);

		/* Can they afford it? */
		const price = userData.stats.donator === 2
			? Math.ceil(item.cost * 0.75)
			: item.cost;

		if (price > userData?.stats?.balance) {
			interaction.followUp({
				content: 'I\'m sorry, you cannot afford this item.',
			});
			return false;
		}

		userData.stats.balance = Number(userData.stats.balance) - price;
		userData.items[item.id] = Number(userData.items[item.id] || 0) + Number(1);

		const embed = new EmbedBuilder()
			.setTitle(`Congrats, ${interaction.user.username}!`)
			.setDescription(`You bought 1 ${item.prof} for **${price}** cents!`)
			.setColor('Green');

		interaction.followUp({
			embeds: [embed],
		});

		/* Set the values in the database */
		await database.setValue('users', interaction.user.id, userData);
		return true;
	},
};
