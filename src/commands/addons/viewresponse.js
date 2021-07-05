const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "viewresponse",
	description: "View a response in a custom addon you have!",
	argument: "Required: the name of the addon, and the number of the response",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this, and you must specify a response *number*",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify the name of the addon you want to view a response of!" });
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		if (cd.first.name.toLowerCase() == name) {
			exists = cd.first;
		}
		if (cd.second.name.toLowerCase() == name) {
			exists = cd.second;
		}
		if (cd.third.name.toLowerCase() == name) {
			exists = cd.third;
		}

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		name = exists.name;

		let responses = exists.responses;
		if (!responses) responses = [];
		let response = responses[args[1] - 1];
		if (!response) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not an existing response number!" });

		const embed = new Discord.MessageEmbed()
			.setTitle(`Response ${args[1]} in ${name}`)
			.setDescription(response)
			.setColor("GREEN");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};