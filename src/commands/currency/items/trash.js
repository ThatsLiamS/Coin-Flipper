/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist } = require('./../../../util/constants.js');
const { achievementAdd, gotItem, database } = require('./../../../util/functions.js');


module.exports = {
	name: 'trash',
	description: 'Place and take items from the trash!',
	usage: '/trash items\n/trash take <item>\n/trash throw <item>',

	permissions: [],
	guildOnly: true,
	cooldown: { time: 15, text: '15 Seconds' },

	data: new SlashCommandBuilder()
		.setName('trash')
		.setDescription('Place and take items from the trash!')
		.setDMPermission(false)

		.addSubcommand(subcommand => subcommand
			.setName('items').setDescription('View the server\'s trash can!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('take').setDescription('Take an object out of the trash!')
			.addStringOption(option => option.setName('item').setDescription('Which item would you like to take:').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('throw').setDescription('Throw an item in the trash!')
			.addStringOption(option => option.setName('item').setDescription('Which item would you like to throw:').setRequired(true)),
		),

	error: false,
	defer: true,

	/**
	 * Place and take items from the trash.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord bot client
	 * @returns {boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Is Trash enabled in the server? */
		const guildData = await database.getValue('guilds', interaction.guild.id);
		if (guildData.features.trash != true) {
			interaction.followUp('The **trash** system has been disabled in this server.');
			return false;
		}

		if (subCommandName == 'items') {

			/* Format trash array to "<emoji> <Name> [(amount)]" */
			const trash = [];
			for (const item of itemlist) {
				if (guildData.trash[item.id] > 0) {
					trash.push(`${item.prof}${guildData.trash[item.id] > 1 ? ` (${guildData.trash[item.id]})` : ''}`);
				}
			}
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.guild.name}'s Trash:`)
				.setDescription(trash?.join('\n') || 'Nothing\'s here ;-;')
				.setFooter({ text: 'Use /trash take <item> to take an item out!' })
				.setColor('#ffffff');

			/* Display and return true to enable cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		/* Fetch the user's stats */
		const userData = await database.getValue('users', interaction.user.id);

		if (subCommandName == 'take') {

			/* Locate the selected item */
			const itemName = interaction.options.getString('item');
			const item = itemlist.filter((i) => i.name == itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];
			if (!item || item == [] || !guildData?.trash[item.id]) {
				interaction.followUp({ content: 'That is not a valid item in the trash.' });
				return false;
			}

			/* Adds the item to the user */
			guildData.trash[item.id] = Number(Number(guildData.trash[item.id]) - 1) || 0;
			userData.items[item.id] = Number(userData.items[item.id] || 0) + 1;
			interaction.followUp({ content: `You took a ${item.prof} out of the trash!` });

			/* Sets the value in the database */
			await database.setValue('users', interaction.user.id, await gotItem(userData, client));
			await database.setValue('guilds', interaction.guild.id, guildData);
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
			if (!userData.items[item.id] || (userData.items[item.id] || 0) < 1) {
				interaction.followUp({ content: 'You do not have that item.' });
				return false;
			}

			/* Adds the item to the user */
			guildData.trash[item.id] = Number(Number(guildData.trash[item.id] || 0) + 1) || 1;
			userData.items[item.id] = (Number(userData.items[item.id]) - 1) || 0;
			interaction.followUp({ content: `You threw away your ${item.prof}! Use \`/trash take\` if you want to get it back!` });

			/* Sets the value in the database */
			await database.setValue('users', interaction.user.id, await achievementAdd(userData, 'throwItAway', client));
			await database.setValue('guilds', interaction.guild.id, guildData);
			return true;
		}

		return false;

	},
};
