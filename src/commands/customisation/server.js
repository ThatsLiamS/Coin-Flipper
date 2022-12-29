/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const defaultData = require('../../util/defaultData/guilds.js');
const emojis = require('../../util/emojis.js');

/* Convert boolean to emoji */
const convert = (boolean) => boolean ? emojis.true : emojis.false;

/* Allow for dynamic customisation */
const features = {
	'flipping': 'Flipping', 'minigames': 'Minigame', 'trash': 'Trash', 'customaddons': 'Custom Addon',
};

module.exports = {
	name: 'server',
	description: 'View and customise server settings!',
	usage: '`/server settings`\n`/server enable <feature>`\n`/server disable <feature>`',

	permissions: ['Manage Guild'],
	guildOnly: true,
	cooldown: { time: 30, text: '30 Seconds' },

	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('View and customise server settings!')
		.setDMPermission(false)

		.addSubcommand(subcommand => subcommand
			.setName('settings')
			.setDescription('View an addon and it\'s responses!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Select a feature to enable!')
			.addStringOption(option => option.setName('feature').setDescription('Select a feature to enable').setRequired(true)
				.addChoices(
					{ name: 'Flipping', value: 'flipping' }, { name: 'Minigames', value: 'minigames' },
					{ name: 'Trash', value: 'trash' }, { name: 'Custom Addons', value: 'customaddons' },
				)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Select a feature to disable!')
			.addStringOption(option => option.setName('feature').setDescription('Select a feature to disable').setRequired(true)
				.addChoices(
					{ name: 'Flipping', value: 'flipping' }, { name: 'Minigames', value: 'minigames' },
					{ name: 'Trash', value: 'trash' }, { name: 'Custom Addons', value: 'customaddons' },
				)),
		),

	error: false,
	defer: true,

	/**
	 * View and customise server settings.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Grab the server's information */
		const collection = await firestore.collection('guilds').doc(interaction.guild.id).get();
		const guildData = collection.data() || defaultData;

		/* Which subcommand was selected */
		if (subCommandName == 'enable') {
			/* Is the feature valid */
			const feature = interaction.options.getString('feature');
			if (!feature || feature == undefined) {
				interaction.followUp({ content: 'Sorry, that is not a valid feature.' });
				return false;
			}

			/* Is it already enabled? */
			if (guildData?.enabled[feature] == true) {
				interaction.followUp({ content: 'That feature is already enabled' });
				return false;
			}

			guildData.enabled[feature] = true;
			interaction.followUp({ content: `Successfully enabled the **${features[feature]} System!**` });

			/* Save the new setting in the database */
			await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);
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
			if (guildData?.enabled[feature] == false) {
				interaction.followUp({ content: 'That feature is already disabled' });
				return false;
			}

			guildData.enabled[feature] = false;
			interaction.followUp({ content: `Successfully disabled the **${features[feature]} System!**` });

			/* Save the new setting in the database */
			await firestore.doc(`/guilds/${interaction.guild.id}`).set(guildData);
			return true;
		}

		if (subCommandName == 'settings') {
			/* Create an embed to send */
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.guild.name}'s Settings!`)
				.addFields(
					{ name: 'Flipping', value: `${convert(guildData?.enabled?.flipping || true)}` },
					{ name: 'Minigames', value: `${convert(guildData?.enabled?.minigames || true)}` },
					{ name: 'Trash', value: `${convert(guildData?.enabled?.trash || true)}` },
					{ name: 'Custom Addons', value: `${convert(guildData?.enabled?.customaddons || true)}` },
				)
				.setTimestamp()
				.setFooter({ text: 'Use "/server enable" and "/server disable" to change these settings' });


			/* return true to enable the cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		/* Unknown issue occured, return false */
		return false;

	},
};
