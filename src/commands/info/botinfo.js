const Discord = require('discord.js');

const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "botinfo",
	description: "View some info about the bot!",
	argument: "None",
	perms: "Embed Links",
	tips: "",
	aliases: ["info", "botstats", 'about'],
	error: true,
	execute: async function(message, args, prefix, client) {

		const guilds = client.guilds.cache.size;
		const members = await client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

		const uptime = `${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s`;

		let mostPopular = { times: 0 };
		let commandStats = client.commandsRun.get("commandsRun", "commandStats");
		for (const property in commandStats) {
			if (commandStats[property] > mostPopular.times) {
				mostPopular = {
					name: property,
					times: commandStats[property]
				};
			}
		}


		const embed = new Discord.MessageEmbed()
			.setTitle(`${client.user.username}'s Info:`)
			.setColor("#cd7f32")
			.addFields(
				{ name: `**Total Servers**`, value: `${guilds}`, inline: true },
				{ name: `**Total Users**`, value: `${members}`, inline: true },
				{ name: `**Total Commands**`, value: `116`, inline: true },

				{ name: `**Ping:**`, value: `\`${client.ws.ping} ms\``, inline: true },
				{ name: `**Uptime:**`, value: `\`${uptime}\``, inline: true },
				{ name: `**Shard**`, value: `\`#1 of out 1\``, inline: true },

				{ name: `**Commands run:**`, value: `\`${client.commandsRun.get("commandsRun", "commandsRun")}\``, inline: true },
				{ name: `**Most Popular Command:**`, value: `\`${mostPopular.name}\``, inline: true },
				{ name: `**Developers:**`, value: `[ThatsLiamS#6950](https://discord.gg/2je9aJynqt)\n[SuperPhantomUser#0441]()\n[AsyncBanana#4612]()`, inline: false },
			);

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};