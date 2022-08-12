const { EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
	name: 'guildCreate',
	once: false,

	execute: async (guild, client) => {
		if (!guild || !guild?.available) return false;

		const ownerId = guild?.ownerId;
		const owner = ownerId ? await client.users.fetch(ownerId) : ownerId;

		const avatarURL = guild?.iconURL() ? guild?.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
		const embed = new EmbedBuilder()
			.setColor('Green')
			.setTitle(`${client.user.username} - Joined a Server!`)
			.addFields(
				{ name: 'Name', value: `${guild?.name}`, inline: true },
				{ name: 'ID', value: `${guild?.id}`, inline: true },
				{ name: 'Owner', value: `${owner || 'Unknown User'}`, inline: true },

				{ name: 'Member Count', value: `${guild?.memberCount} / ${guild.maximumMembers}`, inline: true },
				{ name: 'Created At', value: `${guild?.createdAt}`, inline: true },
				{ name: 'Location', value: `${guild?.preferredLocale || 'Unknown Location'}`, inline: true },
			)
			.setAuthor({ name: guild?.name, iconURL: avatarURL })
			.setFooter({ text: 'Filter keywords: Coin Flipper, guildCreate, Guild, Joined, Create' })
			.setTimestamp();

		const webhook = new WebhookClient({ url: process.env['DeveloperLogs'] });
		webhook.send({ username: client.user.username, avatarURL: client.user.displayAvatarURL(), embeds: [embed] });
	},
};
