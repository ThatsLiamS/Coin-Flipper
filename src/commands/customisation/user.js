/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emojis = require('../../util/emojis.js');
const { database } = require('./../../util/functions.js');

/* Convert boolean to emoji */
const convert = (boolean) => boolean ? emojis.true : emojis.false;

/* Allow for dynamic customisation */
const features = {
	'evil': 'Evil', 'compact': 'Compact',
};

module.exports = {
	name: 'user',
	description: 'View and customise user settings!',
	usage: '/user settings\n/user enable <feature>\n/user disable <feature>',

	permissions: [],
	guildOnly: true,
	cooldown: { time: 30, text: '30 Seconds' },

	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('View and customise user settings!')
		.setDMPermission(true)

		.addSubcommand(subcommand => subcommand
			.setName('settings')
			.setDescription('View an addon and it\'s responses!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('enable')
			.setDescription('Select a feature to enable!')
			.addStringOption(option => option.setName('feature').setDescription('Select a feature to enable').setRequired(true)
				.addChoices(
					{ name: 'Evil Mode', value: 'evil' }, { name: 'Compact Mode', value: 'compact' },
				)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('disable')
			.setDescription('Select a feature to disable!')
			.addStringOption(option => option.setName('feature').setDescription('Select a feature to disable').setRequired(true)
				.addChoices(
					{ name: 'Evil Mode', value: 'evil' }, { name: 'Compact Mode', value: 'compact' },
				)),
		),

	error: false,
	defer: true,

	/**
	 * View and customise user settings.
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

		/* Grab the user's information */
		const userData = await database.getValue('users', interaction.user.id);

		/* Which subcommand was selected */
		if (subCommandName == 'enable') {
			/* Is the feature valid */
			const feature = interaction.options.getString('feature');
			if (!feature || feature == undefined) {
				interaction.followUp({ content: 'Sorry, that is not a valid feature.' });
				return false;
			}

			/* Is it already enabled? */
			if (userData.settings[feature] == true) {
				interaction.followUp({ content: 'That feature is already enabled' });
				return false;
			}

			userData.settings[feature] = true;
			interaction.followUp({ content: `Successfully enabled **${features[feature]} Mode.**` });

			/* Save the new setting in the database */
			await database.setValue('users', interaction.user.id, userData);
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
			if (userData.settings[feature] == false) {
				interaction.followUp({ content: 'That feature is already disabled' });
				return false;
			}

			userData.settings[feature] = false;
			interaction.followUp({ content: `Successfully disabled **${features[feature]} Mode.**` });

			/* Save the new setting in the database */
			await database.setValue('users', interaction.user.id, userData);
			return true;
		}

		if (subCommandName == 'settings') {
			/* Create an embed to send */
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s Settings!`)
				.addFields(
					{ name: 'Evil', value: `${convert(userData?.settings.evil || false)}` },
					{ name: 'Compact', value: `${convert(userData?.settings.compact || false)}` },
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
