/* Import required modules and files */
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { emojis } = require('./../../util/constants.js');
const { database } = require('./../../util/functions.js');

/* Convert boolean to emoji */
const convert = (boolean) => boolean ? emojis.true : emojis.false;

/* Allow for dynamic customisation */
const features = {
	'minigames': 'Minigame', 'trash': 'Trash', 'addons': 'Custom Addon',
};

module.exports = {
	name: 'server',
	description: 'View and customise server settings!',
	usage: '/server settings\n/server enable <feature>\n/server disable <feature>',

	permissions: ['Manage Guild'],
	cooldown: { time: 30, text: '30 Seconds' },
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('View and customise server settings!')

		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

		.addSubcommand(subcommand => subcommand
			.setName('settings')
			.setDescription('View an addon and it\'s responses!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Select a feature to enable!')
			.addStringOption(option => option.setName('feature').setDescription('Select a feature to enable').setRequired(true)
				.addChoices(
					{ name: 'Minigames', value: 'minigames' }, { name: 'Trash', value: 'trash' }, { name: 'Custom Addons', value: 'addons' },
				)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Select a feature to disable!')
			.addStringOption(option => option.setName('feature').setDescription('Select a feature to disable').setRequired(true)
				.addChoices(
					{ name: 'Minigames', value: 'minigames' }, { name: 'Trash', value: 'trash' }, { name: 'Custom Addons', value: 'addons' },
				)),
		),

	/**
	 * View and customise server settings.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Grab the server's information */
		const guildData = await database.getValue('guilds', interaction.guild.id);

		/* Which subcommand was selected */
		if (subCommandName == 'enable') {
			/* Is the feature valid */
			const feature = interaction.options.getString('feature');
			if (!feature || feature == undefined) {
				interaction.followUp({ content: 'Sorry, that is not a valid feature.' });
				return false;
			}

			/* Is it already enabled? */
			if (guildData?.features[feature] == true) {
				interaction.followUp({ content: 'That feature is already enabled' });
				return false;
			}

			guildData.features[feature] = true;
			interaction.followUp({ content: `Successfully enabled the **${features[feature]} System!**` });

			/* Save the new setting in the database */
			await database.setValue('guilds', interaction.guild.id, guildData);
			return true;
		}

		if (subCommandName == 'disable') {
			/* Is the feature valid */
			const feature = interaction.options.getString('feature');
			if (!feature || feature == undefined) {
				interaction.followUp({ content: 'Sorry, that is not a valid feature.' });
				return false;
			}

			/* Is it already enabled? */
			if (guildData?.features[feature] == false) {
				interaction.followUp({ content: 'That feature is already disabled' });
				return false;
			}

			guildData.features[feature] = false;
			interaction.followUp({ content: `Successfully disabled the **${features[feature]} System!**` });

			/* Save the new setting in the database */
			await database.setValue('guilds', interaction.guild.id, guildData);
			return true;
		}

		if (subCommandName == 'settings') {
			/* Create an embed to send */
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.guild.name}'s Settings!`)
				.addFields(
					{ name: 'Minigames', value: `${convert(guildData?.features?.minigames ?? true)}` },
					{ name: 'Trash', value: `${convert(guildData?.features?.trash ?? true)}` },
					{ name: 'Custom Addons', value: `${convert(guildData?.features?.addons ?? true)}` },
				)
				.setTimestamp()
				.setFooter({ text: 'Use "/server enable" and "/server disable" to change these settings' });


			/* return true to enable the cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		/* Unknown issue occurred, return false */
		return false;

	},
};
