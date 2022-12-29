/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist } = require('./../../../util/constants.js');

module.exports = {
	name: 'buy',
	description: 'Buy an item from the shop!',
	usage: '`/buy <item>`',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 30, text: '30 Seconds' },

	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item from the shop!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('item').setDescription('Which item would you like to buy:').setRequired(true)),

	error: false,
	defer: true,

	/**
	 * Buy an item from the shop.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Locate the selected item */
		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.name == itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];

		/* Can you get the item from the shop? */
		if (!item || item?.found != 'shop' && item?.found != 'market') {
			interaction.followUp({ content: 'That is not a valid item to buy.' });
			return false;
		}

		/* Can they afford it? */
		const price = userData.donator == 2 ? Math.ceil(item.cost * 0.75) : item.cost;
		if (price > userData?.currencies?.cents) {
			interaction.followUp({ content: 'I\'m sorry, you cannot afford this item.' });
			return false;
		}

		userData.currencies.cents = Number(userData.currencies.cents) - price;
		userData.inv[item.id] = Number(userData.inv[item.id] || 0) + Number(1);

		const embed = new EmbedBuilder()
			.setTitle(`Congrats, ${interaction.user.username}!`)
			.setDescription(`You bought 1 ${item.prof} for **${price}** cents!`)
			.setColor('Green');

		interaction.followUp({ embeds: [embed] });

		/* Set the new value in the database */
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		/* Return true to enable the cooldown */
		return true;
	},
};