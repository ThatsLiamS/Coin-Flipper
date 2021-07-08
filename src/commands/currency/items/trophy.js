const Discord = require('discord.js');

const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "trophy",
	description: "Flex your trophy on everyone!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	tips: "",
	aliases: ["flex"],
	execute: async function(message, args, prefix, client, [, data]) {

		if (data.data().inv.goldtrophy < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't flex a trophy that you don't have :/" });

		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username} flexes on all of you!`)
			.setImage("https://imgur.com/iqooiDn.jpg")
			.setColor("YELLOW");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};