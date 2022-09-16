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

	/**
	 * View and customise user settings.
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

		/* Grab the user's information */
		const collection = await firestore.collection('users').doc(interaction.user.id).get();
		const userData = collection.data() || defaultData;

		/* Which subcommand was selected */
		if (subCommandName == 'enable') {
			/* Is the feature valid */
			const feature = interaction.options.getString('feature');
			if (!feature || feature == undefined) {
				interaction.followUp({ content: 'Sorry, that is not a valid feature.' });
				return false;
			}

			/* Is it already enabled? */
			if (userData[feature] == true) {
				interaction.followUp({ content: 'That feature is already enabled' });
				return false;
			}

			userData[feature] = true;
			interaction.followUp({ content: `Successfully enabled **${features[feature]} Mode.**` });

			/* Save the new setting in the database */
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
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
			if (userData[feature] == false) {
				interaction.followUp({ content: 'That feature is already disabled' });
				return false;
			}

			userData[feature] = false;
			interaction.followUp({ content: `Successfully disabled **${features[feature]} Mode.**` });

			/* Save the new setting in the database */
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			return true;
		}

		if (subCommandName == 'settings') {
			/* Create an embed to send */
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s Settings!`)
				.addFields(
					{ name: 'Evil', value: `${convert(userData?.evil || true)}` },
					{ name: 'Compact', value: `${convert(userData?.compact || true)}` },
				)
				.setTimestamp()
				.setFooter({ text: 'Use "/user enable" and "/user disable" to change these settings' });


			/* return true to enable the cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		/* Unknown issue occured, return false */
		return false;

	},
};
