const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "cloneaddon",
	description: "Clone a custom addon you have!",
	argument: "The name of the addon you want to create",
	perms: "",
	aliases: ["clone", "duplicateaddon", "duplicate"],
	tips: "Custom addons have to be enabled to use this, and you can only have up to 3 custom addons",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;
		if (cd.first.name.toLowerCase() == args[0]) {
			exists = cd.first;
		}
		if (cd.second.name.toLowerCase() == args[0]) {
			exists = cd.second;
		}
		if (cd.third.name.toLowerCase() == args[0]) {
			exists = cd.third;
		}
		if (!exists) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That isn't a valid custom addon that you have!" });

		let name = args[1];
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You must include what to name your cloned addon!" });
		if (args[2]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon name can't contain spaces!" });
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon name can't be `none` due to technical reasons ||Why would you even name it that anyway||" });
		if (name.length > 50) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That name is too long!" });

		if (cd.first.name != "none" && cd.second.name != "none" && cd.third.name != "none") return send({ channel: message.channel, author: message.author }, { content: "You can only have up to 3 custom addons! You can delete one using `c!deleteaddon`" });

		if (cd.first.name.toLowerCase() == name || cd.second.name.toLowerCase() == name || cd.third.name.toLowerCase() == name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have a custom addon named that!" });
		let array = await checkOnline(firebase, message.author.id, userData);
		userData = array[1];
		let online = array[0];

		let existsOnline = false;

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == name || addonInv.second.name.toLowerCase() == name || addonInv.third.name.toLowerCase() == name) existsOnline = true;
		}

		if (existsOnline == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have an addon in your addon inventory named that!" });

		if (cd.first.name.toLowerCase() == "none") {
			cd.first = {
				name: name,
				description: exists.description,
				responses: exists.responses,
				cost: exists.cost,
				published: false,
				author: message.author.id
			};
		}
		else if (cd.second.name.toLowerCase() == "none") {
			cd.second = {
				name: name,
				description: exists.description,
				responses: exists.responses,
				cost: exists.cost,
				published: false,
				author: message.author.id
			};
		}
		else if (cd.third.name.toLowerCase() == "none") {
			cd.third = {
				name: name,
				description: exists.description,
				responses: exists.responses,
				cost: exists.cost,
				published: false,
				author: message.author.id
			};
		}

		const embed = new Discord.MessageEmbed()
			.setTitle('Cloned addon')
			.setDescription(`You cloned your addon **${exists.name}**! To view your new addon, do \`c!viewaddon ${name}\`!`);
		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

		userData.addons.customaddons = cd;
		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};