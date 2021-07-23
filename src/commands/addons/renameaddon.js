const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "renameaddon",
	description: "Rename a custom addon you have!",
	argument: "The addon name, and the new addon name",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["rename"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!renameaddon <addon name> <new addon name>`" });

		if (args[2]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon name can't have spaces!" });

		let name = args[0];
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let newName = args[1];
		if (newName == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't name your addon `none` because of technical purposes ||why would you want to anyway||" });
		if (newName.length > 50) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That name is too long!" });

		let exists = false;
		let path = false;
		if (cd.first.name == name) {
			exists = cd.first;
			path = "first";
		}
		if (cd.second.name == name) {
			exists = cd.second;
			path = "second";
		}
		if (cd.third.name == name) {
			exists = cd.third;
			path = "third";
		}

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		if (exists.published == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already published your addon! You can't edit it!" });

		if (cd.first.name.toLowerCase() == newName || cd.second.name.toLowerCase() == newName || cd.third.name.toLowerCase() == newName) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have a custom addon named that!" });
		let array = await checkOnline(firebase, message.author.id, userData);
		userData = array[1];
		let online = array[0];

		let onlineExists = false;

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == newName || addonInv.second.name.toLowerCase() == newName || addonInv.third.name.toLowerCase() == newName) onlineExists = true;
		}

		if (onlineExists == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have an addon in your addon inventory named that!" });

		if (name == newName) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon is already named that!" });

		cd[path]["name"] = newName;

		if (exists.serveraddon == true) {
			let sPath = false;
			let guildData = guilddata.data();
			let sad = guildData.serveraddons;
			let alert = false;
			if (sad.first.name.toLowerCase() == name) {
				sPath = "first";
			}
			if (sad.first.name.toLowerCase() == newName.toLowerCase()) {
				alert = true;
			}
			if (sad.second.name.toLowerCase() == name) {
				sPath = "second";
			}
			if (sad.second.name.toLowerCase() == newName.toLowerCase()) {
				alert = true;
			}
			if (sad.third.name.toLowerCase() == name) {
				sPath = "third";
			}
			if (sad.third.name.toLowerCase() == newName.toLowerCase()) {
				alert = true;
			}
			if (alert) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "There's already a server addon with that name!" });
			if (sPath) {
				sad[sPath] = cd[path];
				guildData.serveraddons = sad;
				await firebase.doc(`/guilds/${message.guild.id}`).set(guildData);
			}
		}

		userData.addons.customaddons = cd;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		const embed = new Discord.MessageEmbed()
			.setTitle('Updated addon')
			.setDescription(`You changed your addon's name from \`${name}\` to \`${newName}\`!`);
		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

	}
};