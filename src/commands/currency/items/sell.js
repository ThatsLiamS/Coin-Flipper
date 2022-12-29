/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist } = require('./../../../util/constants.js');

module.exports = {
	name: 'sell',
	description: 'Sell an item to the shop!',
	usage: '`/sell <item>`',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 10, text: '10 Seconds' },

	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell an item to the shop!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('item').setDescription('Which item would you like to sell:').setRequired(true)),

	error: false,
	defer: true,

	/**
	 * Sell an item to the shop.
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

		/* Can you sell it? */
		if (!item) {
			interaction.followUp({ content: 'That is not a valid item to sell.' });
			return false;
		}

		if (userData?.inv[item.id] < 1) {
			interaction.followUp({ content: 'You don\'t have that item to sell.' });
			return false;
		}

		/* How much for? */
		const price = item.sell ? item.sell : Math.ceil(item.cost / 2);
		userData.currencies.cents = Number(userData.currencies.cents) + price;

		userData.inv[item.id] = Number(userData.inv[item.id]) - Number(1);

		const embed = new EmbedBuilder()
			.setTitle(`Congrats, ${interaction.user.username}!`)
			.setDescription(`You sold 1 ${item.prof} for **${price}** cents!`)
			.setColor('Green');

		interaction.followUp({ embeds: [embed] });

		/* Set the new values in the database */
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		/* Return true to enable the cooldown */
		return true;
	},
};