const Discord = require('discord.js');

const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "analytics",
	aliases: ["statistics"],
	developerOnly: true,
	execute: async function(message, args, prefix, client) {

		let commandStats = client.commandsRun.get("commandsRun", "commandStats");
		let commandAnalytics = [];

		for (const property in commandStats) {
			commandAnalytics.push({ label: property, count: commandStats[property] });
		}

		commandAnalytics = commandAnalytics.sort((a, b) => b.count - a.count);
		commandAnalytics = commandAnalytics.slice(0, 10);
		let commandStatistics = [];

		for (const cmd of commandAnalytics) {
			commandStatistics.push(`**${cmd.label.charAt(0).toUpperCase() + cmd.label.slice(1)}:** \`${cmd.count}\``);
		}

		const embed = new Discord.MessageEmbed()
			.setTitle("Coin Flipper Analytics")
			.setDescription("The most popular commands in Coin Flipper")
			.addField("Analytics", commandStatistics)
			.setColor('ORANGE');

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};