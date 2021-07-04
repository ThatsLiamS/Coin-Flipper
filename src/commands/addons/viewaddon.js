const checkGuild = require("../../tools/checkGuild");
const checkOnline = require("../../tools/checkOnline");
module.exports = {
	name: `viewaddon`,
	description: "View a custom or bought addon that you have!",
	argument: "Required: the name of the addon\nOptional: `Separate`",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this, and using `Separate` as a 2nd argument only shows the number of responses instead of all of them",
	aliases: ["view"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send("You need to specify the name of the addon you want to view!");
		if (name == "none") return send("That's not a valid addon!");

		if (cd.first.name.toLowerCase() == name) {
			exists = cd.first;
		}
		if (cd.second.name.toLowerCase() == name) {
			exists = cd.second;
		}
		if (cd.third.name.toLowerCase() == name) {
			exists = cd.third;
		}

		let array = await checkOnline(firestore, msg.author.id, userData);
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

		if (exists == false) return send("That's not a valid addon!");

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

		let embed = new discord.MessageEmbed()
			.setTitle(`Addon ${name}`)
			.setDescription(`Description: ${description}\nCost: ${cost}`)
			.setColor("GREEN");
		if (args[1] == "separate") embed.addField("Responses", `${responses.length} responses`);
		else embed.addField("Responses", responses);
		embed.addField("Published", published);
		msg.channel.send(embed).catch(() => {
			if (msg.guild.me.hasPermission("EMBED_LINKS")) {
				send("You have too many responses to be viewed in a Discord embed! To view your addon separately, use `c!viewaddon <addon name> separate`");
			}
			else{
				msg.channel.send("Sorry, I don't have the right permissions to use that command!").catch(() => {});
			}
		});
	}
};