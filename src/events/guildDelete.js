/* Import required modules and files */
const { EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
	name: 'guildDelete',
	once: false,

	/**
	 * Triggered when the bot leaves a server.
	 *
	 * @param {object} guild - Discord Server object
	 * @param {object} client - Discord Client object
	 *
	 * @returns {void}
	**/
	execute: async (guild, client) => {
		/* Is the guild available */
		if (!guild || !guild?.available) return false;

		/* Who owns the guild */
		const ownerId = guild?.ownerId;
		const owner = ownerId ? await client.users.fetch(ownerId) : ownerId;

		/* Create the guild information embed */
		const avatarURL = guild?.iconURL() ? guild?.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
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
			.setAuthor({ name: guild?.name, iconURL: avatarURL })
			.setFooter({ text: 'Filter keywords: Coin Flipper, guildDelete, Guild, Left, Delete' })
			.setTimestamp();

		/* Locate and send the webhook */
		const webhook = new WebhookClient({ url: process.env['DeveloperLogs'] });
		webhook.send({ username: client.user.username, avatarURL: client.user.displayAvatarURL(), embeds: [embed] });
	},
};
