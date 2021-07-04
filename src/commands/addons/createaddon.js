const checkGuild = require("../../tools/checkGuild");
const checkOnline = require("../../tools/checkOnline");
const achievementAdd = require("../../tools/achievementAdd");
module.exports = {
	name: "createaddon",
	description: "Create a new custom addon!",
	argument: "The name of the addon you want to create",
	perms: "",
	tips: "Custom addons have to be enabled to use this, and you can only have up to 3 custom addons",
	aliases: ["create", "add", "addaddon"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let name = args[0];
		if (!name) return send("You must include what to name your addon!");
		if (args[1]) return send("Your addon name can't contain spaces!");
		if (name == "none") return send("Your addon name can't be `none` because of technical purposes ||Why would you even name it that anyway||");
		if (name.length > 50) return send("That name is too long!");

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (cd.first.name.toLowerCase() != "none" && cd.second.name.toLowerCase() != "none" && cd.third.name.toLowerCase() != "none") return send("You already have a maximum of 3 custom addons! You can delete one using `c!deleteaddon`");

		if (cd.first.name.toLowerCase() == name || cd.second.name.toLowerCase() == name || cd.third.name.toLowerCase() == name) return send("You alraedy have a custom addon named that!");
		let array = await checkOnline(firestore, msg.author.id, userData);
		userData = array[1];
		let online = array[0];

		let exists = false;

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == name || 	addonInv.second.name.toLowerCase() == name || addonInv.third.name.toLowerCase() == name) exists = true;
		}

		if (exists == true) return send("You already have an addon in your addon inventory named that!");

		if (cd.first.name.toLowerCase() == "none") {
			cd.first = {
				name: name,
				description: "",
				responses: ["The coin landed on heads", "The coin landed on tails"],
				cost: 0,
				published: false,
				author: msg.author.id
			};
		}
		else if (cd.second.name.toLowerCase() == "none") {
			cd.second = {
				name: name,
				description: "",
				responses: ["The coin landed on heads", "The coin landed on tails"],
				cost: 0,
				published: false,
				author: msg.author.id
			};
		}
		else if (cd.third.name.toLowerCase() == "none") {
			cd.third = {
				name: name,
				description: "",
				responses: ["The coin landed on heads", "The coin landed on tails"],
				cost: 0,
				published: false,
				author: msg.author.id
			};
		}
		send(`You created your addon **${name}**! To view it, do \`c!viewaddon ${name}\`!`);
		userData.addons.customaddons = cd;

		userData = await achievementAdd(userData, "builder");
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};