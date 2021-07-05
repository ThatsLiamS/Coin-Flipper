const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "searchaddon",
	description: "Search the addon for a specific query!",
	argument: "The name of the addon you want to search, and the query (all addons that match or include it will show up)",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["search"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify the name of the addon you want to search!" });
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

		let query = args.slice(1).join(" ");
		if (!query) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify what you want to search for!" });
		let matching = [];

		let next = 1;
		for (let response of exists.responses) {
			if (response.toLowerCase().includes(query)) matching.push(`Response ${next}: \`${response}\``);
			next++;
		}

		let length = matching.length;
		if (length === 0) matching = "None";

		const embed = new Discord.MessageEmbed()
			.setTitle(`Found ${length} responses that match that!`)
			.setDescription(`You searched for: \`${query}\``)
			.addField("Matching responses:", matching)
			.setColor("#ffaa00");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};