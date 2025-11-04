const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { makeGrid } = require('./../../util/functions');


module.exports = {
	name: 'about',
	description: 'Shows lots of cool information about the bot!',
	usage: '/about',

	cooldown: {
		time: 0,
		text: 'None (0)',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Shows lots of cool information about the bot!')
		.setDMPermission(false),

	/**
	 * Shows lots of cool information about the bot.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord Client object
	 * @returns {boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Fetch values from all the shards */
		const promises = [
			client.shard.fetchClientValues('ws.ping'),
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(() => this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		];
		const results = await Promise.all(promises);

		/* Create the embed full of information */
		const embed = new EmbedBuilder()
			.setTitle('My Information')
			.setColor('Green')
			.setDescription('Hey, I\'m **[' + client.user.tag + '](https://coinflipper.liamskinner.co.uk/)**!\n```\n' + makeGrid(results) + '\n```')
			.addFields(
				{ name: '**Total Servers:**', value: results[1].reduce((acc, guildCount) => acc + guildCount, 0).toString(), inline: true },
				{ name: '**Total Users:**', value: results[2].reduce((acc, memberCount) => acc + memberCount, 0).toString(), inline: true },
				{ name: '**Total Commands:**', value: '51', inline: true },

				{ name: '**Uptime:**', value: `\`${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``, inline: true },
				{ name: '**Shard ID:**', value: `\`#${Number(interaction.guild.shardId) + 1} out of ${client.shard.count}\``, inline: true },
				{ name: '**Developers:**', value: '**[ThatsLiamS#6950](https://discord.gg/2je9aJynqt)**\n[SuperPhantomUser#0441](https://github.com/SuperPhantomUser)', inline: true },
			)
			.setFooter({
				text: 'Do /help to get started.',
			});

		/* Create row of buttons */
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Invite')
					.setURL('https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Support Server')
					.setURL('https://discord.gg/2je9aJynqt'),
			);

		/* returns true to enable the cooldown */
		interaction.followUp({
			embeds: [embed],
			components: [row],
		});

		return true;
	},
};
