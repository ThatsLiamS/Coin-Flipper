/* Import required modules and files */
const admin = require('firebase-admin');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { itemlist } = require('../../../util/constants');
const { achievementAdd, gotItem } = require('../../../util/functions.js');
const defaultData = require('../../../util/defaultData/guilds');

module.exports = {
	name: 'trash',
	description: 'Place and take items from the trash!',
	usage: '`/trash items`\n`/trash take <item>`\n`/trash throw <item>`',

	permissions: [],
	guildOnly: true,
	cooldown: { time: 15, text: '15 Seconds' },

	data: new SlashCommandBuilder()
		.setName('trash')
		.setDescription('Place and take items from the trash!')
		.setDMPermission(false)

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
	defer: true,

	/**
	 * Place and take items from the trash.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Is Trash enabled in the server? */
		const collection = await firestore.doc(`/guilds/${interaction.guild.id}`).get();
		const guildData = collection.data() || defaultData;
		if (guildData.enabled.trash == false) {
			interaction.followUp('The **trash** system has been disabled in this server.');
			return false;
		}

		if (subCommandName == 'items') {

			/* Format trash array to "<emoji> <Name>" */
			const trash = guildData?.trash?.map((a) => itemlist.filter((b) => a == b.name)[0].prof);

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.guild.name}'s Trash:`)
				.setDescription(trash?.join('\n') || 'Nothing\'s here ;-;')
				.setFooter({ text: 'Use /trash take <item> to take an item out!' })
				.setColor('#ffffff');

			/* Display and return true to enable cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'take') {

			/* Locate the selected item */
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

			/* Remove the item from the trash */
			if (guildData.trash.length == 1) {
				await firestore.doc(`/guilds/${interaction.guild.id}`).update({ 'trash': admin.firestore.FieldValue.delete() });
			}
			else {
				await firestore.doc(`/guilds/${interaction.guild.id}`).update({ 'trash': admin.firestore.FieldValue.arrayRemove(item.name) });
			}

			/* Adds the item to the user */
			userData.inv[item.id] = Number(userData.inv[item.id]) + 1;
			userData = gotItem(userData);
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);

			/* return true to enable the cooldown */
			interaction.followUp({ content: `You took a ${item.prof} out of the trash!` });
			return true;
		}

		if (subCommandName == 'throw') {

			/* Locate the selected item */
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

			/* removing the item from the user */
			userData.inv[item.id] = Number(userData.inv[item.id]) - 1;
			userData = await achievementAdd(userData, 'throwItAway');

			/* Add the item to the trash */
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			await firestore.doc(`/guilds/${interaction.guild.id}`).update({ 'trash': admin.firestore.FieldValue.arrayUnion(item.name) });

			interaction.followUp({ content: `You threw away your ${item.prof}! Use \`/trash take\` if you want to get it back!` });

			/* returns true to enable the cooldown */
			return true;
		}

		return false;
	},
};
