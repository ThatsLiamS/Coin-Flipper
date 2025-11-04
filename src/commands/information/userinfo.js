const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { emojis } = require('./../../util/constants');
const { database } = require('./../../util/functions');


module.exports = {
	name: 'userinfo',
	description: 'View a user\'s stats!',
	usage: '/userinfo [user]',

	cooldown: {
		time: 15,
		text: '15 Seconds',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('View a user\'s stats!')
		.setDMPermission(true)

		.addUserOption(option => option
			.setName('user')
			.setDescription('Select a user')
			.setRequired(false),
		),

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
		let donorStatus = 'none';
		if (userData.stats.donator === 1) {
			donorStatus = 'gold tier';
		} else if (userData.stats.donator === 2) {
			donorStatus = 'platinum tier';
		}

		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s information`)
			.setColor('#cd7f32')
			.addFields(
				{ name: '**Settings**', value: `Evil mode: ${userData.settings.evil ? emojis.true : emojis.false }\nCompact mode: ${userData.settings.compact ? emojis.true : emojis.false }\nOnline mode: ${emojis.false}`, inline: false },
				{ name: '**Stats**', value: `Coins flipped: \`${userData.stats.flips}\`\nMinigames won: \`${userData.stats.minigames}\`\nTimes worked: \`${userData.stats.worked}\``, inline: false },
				{ name: '**Donator Status**', value: `${donorStatus}`, inline: false },
			);

		/* Returns true to enable the cooldown */
		interaction.followUp({
			embeds: [embed],
		});
		return true;

	},
};
