const admin = require('firebase-admin');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const achievementAdd = require('../../../util/achievementAdd');
const { itemlist } = require('../../../util/constants');
const gotItem = require('../../../util/gotItem');
const defaultData = require('../../../util/defaultData/guilds');

module.exports = {
	name: 'trash',
	description: 'Place and take items from the trash!',
	usage: '`/trash items`\n`/trash take <item>`\n`/trash throw <item>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('trash')
		.setDescription('Place and take items from the trash!')

		.addSubcommand(subcommand => subcommand
			.setName('items')
			.setDescription('View the server\'s trash can!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('take')
			.setDescription('Take an object out of the trash!')
			.addStringOption(option => option.setName('item').setDescription('Which item would you like to take:').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('throw')
			.setDescription('Throw an item in the trash!')
			.addStringOption(option => option.setName('item').setDescription('Which item would you like to throw:').setRequired(true)),
		),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		const collection = await firestore.doc(`/guilds/${interaction.guild.id}`).get();
		const guildData = collection.data() || defaultData;
		if (guildData.enabled.trash == false) {
			interaction.followUp('The **trash** system has been disabled in this server.');
			return false;
		}

		if (subCommandName == 'items') {

			const trash = guildData?.trash?.map((a) => itemlist.filter((b) => a == b.name)[0].prof);

			const embed = new MessageEmbed()
				.setTitle(`${interaction.guild.name}'s Trash:`)
				.setDescription(trash?.join('\n') || 'Nothing\'s here ;-;')
				.setFooter({ text: 'Use /trash take <item> to take an item out!' })
				.setColor('#ffffff');

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'take') {

			const itemName = interaction.options.getString('item');
			const item = itemlist.filter((i) => i.name == itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];
			if (!item) {
				interaction.followUp({ content: 'That is not a valid item name.' });
				return false;
			}

			if (!guildData?.trash?.includes(item.name)) {
				interaction.followUp({ content: 'That item is not in the trash.' });
				return false;
			}

			userData.inv[item.id] = Number(userData.inv[item.id]) + 1;
			if (guildData.trash.length == 1) {
				await firestore.doc(`/guilds/${interaction.guild.id}`).update({ 'trash': admin.firestore.FieldValue.delete() });
			}
			else {
				await firestore.doc(`/guilds/${interaction.guild.id}`).update({ 'trash': admin.firestore.FieldValue.arrayRemove(item.name) });
			}

			userData = gotItem(userData);
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);

			interaction.followUp({ content: `You took a ${item.prof} out of the trash!` });
			return true;
		}

		if (subCommandName == 'throw') {

			const itemName = interaction.options.getString('item');
			const item = itemlist.filter((i) => i.name == itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];
			if (!item || item == []) {
				interaction.followUp({ content: 'That is not a valid item name.' });
				return false;
			}
			if (userData?.inv?.[item.id] < 1) {
				interaction.followUp({ content: 'You do not have that item.' });
				return false;
			}

			userData.inv[item.id] = Number(userData.inv[item.id]) - 1;
			userData = await achievementAdd(userData, 'throwItAway');

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			await firestore.doc(`/guilds/${interaction.guild.id}`).update({ 'trash': admin.firestore.FieldValue.arrayUnion(item.name) });

			interaction.followUp({ content: `You threw away your ${item.prof}! Use \`/trash take\` if you want to get it back!` });

			return true;
		}

		return false;
	},
};
