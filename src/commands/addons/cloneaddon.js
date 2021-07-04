const checkGuild = require("../../tools/checkGuild");
const checkOnline = require("../../tools/checkOnline");
module.exports = {
	name: "cloneaddon",
	description: "Clone a custom addon you have!",
	argument: "The name of the addon you want to create",
	perms: "",
	aliases: ["clone", "duplicateaddon", "duplicate"],
	tips: "Custom addons have to be enabled to use this, and you can only have up to 3 custom addons",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
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
		if (!exists) return send("That isn't a valid custom addon that you have!");

		let name = args[1];
		if (!name) return send("You must include what to name your cloned addon!");
		if (args[2]) return send("Your addon name can't contain 	spaces!");
		if (name == "none") return send("Your addon name can't be `none` because of technical purposes ||Why would you even name it that anyway||");
		if (name.length > 50) return send("That name is too long!");

		if (cd.first.name != "none" && cd.second.name != "none" && cd.third.name != "none") return send("You can only have up to 3 custom addons! You can delete one using `c!deleteaddon`");

		if (cd.first.name.toLowerCase() == name || cd.second.name.toLowerCase() == name || cd.third.name.toLowerCase() == name) return send("You alraedy have a custom addon named that!");
		let array = await checkOnline(firestore, msg.author.id, userData);
		userData = array[1];
		let online = array[0];

		let existsOnline = false;

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == name || 	addonInv.second.name.toLowerCase() == name || addonInv.third.name.toLowerCase() == name) existsOnline = true;
		}

		if (existsOnline == true) return send("You already have an addon in your addon inventory named that!");

		if (cd.first.name.toLowerCase() == "none") {
			cd.first = {
				name: name,
				description: exists.description,
				responses: exists.responses,
				cost: exists.cost,
				published: false,
				author: msg.author.id
			};
		}
		else if (cd.second.name.toLowerCase() == "none") {
			cd.second = {
				name: name,
				description: exists.description,
				responses: exists.responses,
				cost: exists.cost,
				published: false,
				author: msg.author.id
			};
		}
		else if (cd.third.name.toLowerCase() == "none") {
			cd.third = {
				name: name,
				description: exists.description,
				responses: exists.responses,
				cost: exists.cost,
				published: false,
				author: msg.author.id
			};
		}
		send(`You cloned your addon **${exists.name}**! To view your new addon, do \`c!viewaddon ${name}\`!`);
		userData.addons.customaddons = cd;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};