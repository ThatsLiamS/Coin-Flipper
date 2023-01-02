/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emojis = require('./../../util/emojis');
const { database } = require('./../../util/functions.js');

module.exports = {
	name: 'userinfo',
	description: 'View a user\'s stats!',
	usage: '/userinfo [user]',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 15, text: '15 Seconds' },

	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('View a user\'s stats!')
		.setDMPermission(true)

		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)),

	error: false,
	defer: true,

	/**
	 * Collection of user-based, custom addons.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Get the user's information */
		const user = interaction.options.getUser('user') || interaction.user;
		const userData = await database.getValue('users', user.id);

		/* Create the information embed */
		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s information`)
			.setColor('#cd7f32')
			.addFields(
				{ name: '**Settings**', value: `Evil mode: ${userData.settings.evil ? emojis.true : emojis.false }\nCompact mode: ${userData.settings.compact ? emojis.true : emojis.false }\nOnline mode: ${emojis.false}`, inline: false },
				{ name: '**Stats**', value: `Coins flipped: \`${userData.stats.flips}\`\nMinigames won: \`${userData.stats.minigames}\`\nTimes worked: \`${userData.stats.worked}\``, inline: false },
				{ name: '**Donator Status**', value: `${userData.stats.donator == 0 ? 'None' : (userData.stats.donator == 1 ? 'Gold' : 'Platinum')}`, inline: false },
			);

		/* Returns true to enable the cooldown */
		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
