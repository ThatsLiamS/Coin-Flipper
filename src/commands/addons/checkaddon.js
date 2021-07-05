const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);
const profanityCheckAddon = require(`${__dirname}/../../tools/profanities`).profanityCheckAddon;

module.exports = {
	name: "checkaddon",
	description: "Check a custom addon you have for profanities!",
	argument: "Required: the name of the addon\nOptional: `Separate`",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this, and using `Separate` as a 2nd argument only shows the number of responses instead of all of them",
	aliases: ["check", "checkprofanity", "checkprofanities", "profanitycheck", "profanitiescheck"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify the name of the addon you want to check!" });
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

		let places = profanityCheckAddon(exists, false);
		if (!places.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle("✨ Squeaky clean!")
				.setDescription("Your addon has no profanities!")
				.setColor("GREEN");
			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
		}
		else {
			const embed = new Discord.MessageEmbed()
				.setTitle(`Your addon has ${places.length} profanities!`)
				.setDescription(places)
				.setColor("RED");
			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
		}
	}
};