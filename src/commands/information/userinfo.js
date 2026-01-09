// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, CommandInteraction } = require('discord.js');

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
	 * @async @function
	 * @group Commands @subgroup Information
	 * @summary User management - displays information
	 * 
	 * @param {Object} param
	 * @param {CommandInteraction} param.interaction - DiscordJS Slash Command Object
	 * 
	 * @returns {Promise<boolean>} True (Success) - triggers cooldown.
	 * @returns {Promise<boolean>} False (Error) - skips cooldown.
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
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

		const evilToggle = userData.settings.evil
			? emojis.true
			: emojis.false;

		const compactToggle = userData.settings.compact
			? emojis.true
			: emojis.false;

		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s information`)
			.setColor('#cd7f32')
			.addFields(
				{ name: '**Settings**', value: `Evil mode: ${evilToggle}\nCompact mode: ${compactToggle}\nOnline mode: ${emojis.false}`, inline: false },
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
