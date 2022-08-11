const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { itemlist } = require('./../../../util/constants.js');

module.exports = {
	name: 'sell',
	description: 'Sell an item to the shop!',
	usage: '`/sell <item>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell an item to the shop!')

		.addStringOption(option => option.setName('item').setDescription('Which item would you like to sell:').setRequired(true)),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.name == itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];

		if (!item) {
			interaction.followUp({ content: 'That is not a valid item to sell.' });
			return false;
		}

		if (userData?.inv[item.id] < 1) {
			interaction.followUp({ content: 'You don\'t have that item to sell.' });
			return false;
		}

		const price = item.sell ? item.sell : Math.ceil(item.cost / 2);
		userData.currencies.cents = Number(userData.currencies.cents) + price;

		userData.inv[item.id] = Number(userData.inv[item.id]) - Number(1);

		const embed = new EmbedBuilder()
			.setTitle(`Congrats, ${interaction.user.username}!`)
			.setDescription(`You sold 1 ${item.prof} for **${price}** cents!`)
			.setColor('GREEN');

		interaction.followUp({ embeds: [embed] });

		await firestore.doc(`/users/${interaction.user.id}`).set(userData);
		return true;
	},
};