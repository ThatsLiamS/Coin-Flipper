const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "createaddon",
	description: "Create a new custom addon!",
	argument: "The name of the addon you want to create",
	perms: "",
	tips: "Custom addons have to be enabled to use this, and you can only have up to 3 custom addons",
	aliases: ["create", "add", "addaddon"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let name = args[0];

		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You must include what to name your addon!" });
		if (args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon name can't contain spaces!" });
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon name can't be `none` because of technical purposes ||Why would you even name it that anyway||" });
		if (name.length > 50) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That name is too long!" });

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (cd.first.name.toLowerCase() != "none" && cd.second.name.toLowerCase() != "none" && cd.third.name.toLowerCase() != "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have a maximum of 3 custom addons! You can delete one using `c!deleteaddon`" });

		if (cd.first.name.toLowerCase() == name || cd.second.name.toLowerCase() == name || cd.third.name.toLowerCase() == name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You alraedy have a custom addon named that!" });
		let array = await checkOnline(firebase, message.author.id, userData);
		userData = array[1];
		let online = array[0];

		let exists = false;

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == name || addonInv.second.name.toLowerCase() == name || addonInv.third.name.toLowerCase() == name) exists = true;
		}

		if (exists == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have an addon in your addon inventory named that!" });

		if (cd.first.name.toLowerCase() == "none") {
			cd.first = {
				name: name,
				description: "",
				responses: ["The coin landed on heads", "The coin landed on tails"],
				cost: 0,
				published: false,
				author: message.author.id
			};
		}
		else if (cd.second.name.toLowerCase() == "none") {
			cd.second = {
				name: name,
				description: "",
				responses: ["The coin landed on heads", "The coin landed on tails"],
				cost: 0,
				published: false,
				author: message.author.id
			};
		}
		else if (cd.third.name.toLowerCase() == "none") {
			cd.third = {
				name: name,
				description: "",
				responses: ["The coin landed on heads", "The coin landed on tails"],
				cost: 0,
				published: false,
				author: message.author.id
			};
		}
		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You created your addon **${name}**! To view it, do \`c!viewaddon ${name}\`!` });
		userData.addons.customaddons = cd;

		userData = await achievementAdd(userData, "builder");
		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};