// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, WebhookClient, Guild, Client } = require('discord.js');

module.exports = {
	name: 'guildDelete',
	once: false,

	/**
	 * @async @function
	 * @group Events
	 * @summary Logs upon leaving a guild
	 * 
	 * @param {Guild} guild - DiscordJS Guild Object
	 * @param {Client} client - DiscordJS Bot Client Object
	 * 
	 * @returns {Promise<boolean>} True (Success)
	 * @returns {Promise<boolean>} False (Error)
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async (guild, client) => {
		/* Is the guild available */
		if (!guild || !guild?.available) {
			return false;
		}

		/* Who owns the guild */
		const ownerId = guild.ownerId;
		const owner = ownerId
			? await client.users.fetch(ownerId)
			: ownerId;

		/* Create the guild information embed */
		const avatarURL = guild.iconURL()
			? guild.iconURL()
			: 'https://i.imgur.com/yLv2YVnh.jpg';

		const embed = new EmbedBuilder()
			.setColor('Red')
			.setTitle(`${client.user.username} - Left a Server!`)
			.addFields(
				{ name: 'Name', value: `${guild?.name}`, inline: true },
				{ name: 'ID', value: `${guild?.id}`, inline: true },
				{ name: 'Owner', value: `${owner || 'Unknown User'}`, inline: true },

				{ name: 'Member Count', value: `${guild?.memberCount} / ${guild.maximumMembers}`, inline: true },
				{ name: 'Created At', value: `${guild?.createdAt}`, inline: true },
				{ name: 'Location', value: `${guild?.preferredLocale || 'Unknown Location'}`, inline: true },
			)
			.setAuthor({
				name: guild?.name,
				iconURL: avatarURL,
			})
			.setFooter({
				text: 'Filter keywords: Coin Flipper, guildDelete, Guild, Left, Delete',
			})
			.setTimestamp();

		/* Locate and send the webhook */
		const webhook = new WebhookClient({
			url: process.env['DeveloperLogs'],
		});
		webhook.send({
			username: client.user.username,
			avatarURL: client.user.displayAvatarURL(),
			embeds: [embed],
		});

		return true;
	},
};
