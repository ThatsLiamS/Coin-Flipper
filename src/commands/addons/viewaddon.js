const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: `viewaddon`,
	description: "View a custom or bought addon that you have!",
	argument: "Required: the name of the addon\nOptional: `Separate`",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this, and using `Separate` as a 2nd argument only shows the number of responses instead of all of them",
	aliases: ["view"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify the name of the addon you want to view!" });
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

		let array = await checkOnline(firebase, message.author.id, userData);
		let online = array[0];
		userData = array[1];

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == name) {
				exists = addonInv.first;
			}
			if (addonInv.second.name.toLowerCase() == name) {
				exists = addonInv.second;
			}
			if (addonInv.third.name.toLowerCase() == name) {
				exists = addonInv.third;
			}
		}

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		name = exists.name;

		let description = exists.description;
		if (!description) description = "This addon has no description!";
		let responses = exists.responses;
		if (!responses) responses = [];
		let newResponses = [];
		for (let response of responses) {
			newResponses.push(`\`${responses.indexOf(response) + 1}.\` ${response}`);
		}
		if (!responses.length) responses = "This addon has no responses!";
		else responses = newResponses;
		let published = exists.published;
		if (published) published = "Yes";
		else published = "No";
		let cost = exists.cost;

		const embed = new Discord.MessageEmbed()
			.setTitle(`Addon ${name}`)
			.setDescription(`Description: ${description}\nCost: ${cost}`)
			.setColor("GREEN");

		if (args[1] == "separate") embed.addField("Responses", `${responses.length} responses`);

		else embed.addField("Responses", responses);
		embed.addField("Published", published);

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};