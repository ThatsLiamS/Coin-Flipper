const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { itemlist } = require('./../../../util/constants.js');

module.exports = {
	name: 'buy',
	description: 'Buy an item from the shop!',
	usage: '`/buy <item>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item from the shop!')

		.addStringOption(option => option.setName('item').setDescription('Which item would you like to buy:').setRequired(true)),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.name == itemName.toLowerCase())[0];

		if (!item || item?.found != 'shop' && item?.found != 'market') {
			interaction.followUp({ content: 'That is not a valid item to buy.' });
			return false;
		}

		const price = userData.donator == 2 ? Math.ceil(item.cost * 0.75) : item.cost;
		if (price > userData?.currencies?.cents) {
			interaction.followUp({ content: 'I\'m sorry, you cannot afford this item.' });
			return false;
		}

		userData.currencies.cents = Number(userData.currencies.cents) - price;
		userData.inv[item.id] = Number(userData.inv[item.id] || 0) + Number(1);

		const embed = new MessageEmbed()
			.setTitle(`Congrats, ${interaction.user.username}!`)
			.setDescription(`You bought 1 ${item.prof} for **${price}** cents!`)
			.setColor('GREEN');

		interaction.followUp({ embeds: [embed] });

		await firestore.doc(`/users/${interaction.user.id}`).set(userData);
		return true;
	},
};