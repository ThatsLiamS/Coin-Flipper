const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const makeGrid = require('./../../util/makeGrid');

module.exports = {
	name: 'about',
	description: 'Shows lots of cool information about the bot!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Shows lots of cool information about the bot!'),

	error: false,
	execute: async ({ interaction, client }) => {

		const promises = [
			client.shard.fetchClientValues('ws.ping'),
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(() => this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		];
		const results = await Promise.all(promises);

		const embed = new MessageEmbed()
			.setTitle('My Information')
			.setColor('GREEN')
			.setDescription('Hey, I\'m **[' + client.user.tag + '](https://discord.gg/2je9aJynqt)**!\n```\n' + makeGrid(results) + '\n```')
			.addFields(
				{ name: '**Total Servers:**', value: results[1].reduce((acc, guildCount) => acc + guildCount, 0).toString(), inline: true },
				{ name: '**Total Users:**', value: results[2].reduce((acc, memberCount) => acc + memberCount, 0).toString(), inline: true },
				{ name: '**Total Commands:**', value: '100', inline: true },

				{ name: '**Uptime:**', value: `\`${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``, inline: true },
				{ name: '**Shard ID:**', value: `\`#${Number(interaction.guild.shardId) + 1} out of ${client.shard.count}\``, inline: true },
				{ name: '**Developers:**', value: '**[ThatsLiamS#6950](https://discord.gg/2je9aJynqt)**\n[SuperPhantomUser#0441](https://github.com/SuperPhantomUser)', inline: true },
			)
			.setFooter({ text: 'Do /help to get started.' });

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('LINK').setLabel('Invite').setURL('https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands'),
				new MessageButton()
					.setStyle('LINK').setLabel('Support Server').setURL('https://discord.gg/2je9aJynqt'),
			);

		interaction.followUp({ embeds: [embed], components: [row] });

	},
};