const checkGuild = require("../../tools/checkGuild");
const checkOnline = require("../../tools/checkOnline");
module.exports = {
	name: "renameaddon",
	description: "Rename a custom addon you have!",
	argument: "The addon name, and the new addon name",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["rename"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send("Phrase the command like this: `c!renameaddon <addon name> <new addon name>`");

		if (args[2]) return send("Your addon name can't have spaces!");

		let name = args[0];
		if (name == "none") return send("That's an invalid addon name!");

		let newName = args[1];
		if (newName == "none") return send("You can't name your addon `none` because of technical purposes ||why would you want to anyway||");
		if (newName.length > 50) return send("That name is too long!");

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

		if (exists == false) return send("That's an invalid addon name!");

		if (exists.published == true) return send("You already published your addon! You can't edit it!");

		if (cd.first.name.toLowerCase() == newName || cd.second.name.toLowerCase() == newName || cd.third.name.toLowerCase() == newName) return send("You already have a custom addon named that!");
		let array = await checkOnline(firestore, msg.author.id, userData);
		userData = array[1];
		let online = array[0];

		let onlineExists = false;

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == newName || addonInv.second.name.toLowerCase() == newName || addonInv.third.name.toLowerCase() == newName) onlineExists = true;
		}

		if (onlineExists == true) return send("You already have an addon in your addon inventory named that!");

		if (name == newName) return send("Your addon is already named that!");

		cd[path]["name"] = newName;

		if (exists.serveraddon == true) {
			let sExists = false;
			let sPath = false;
			let guildData = guilddata.data();
			let sad = guildData.serveraddons;
			let alert = false;
			if (sad.first.name.toLowerCase() == name) {
				sExists = cd.first;
				sPath = "first";
			}
			if (sad.first.name.toLowerCase() == newName.toLowerCase()) {
				alert = true;
			}
			if (sad.second.name.toLowerCase() == name) {
				sExists = cd.second;
				sPath = "second";
			}
			if (sad.second.name.toLowerCase() == newName.toLowerCase()) {
				alert = true;
			}
			if (sad.third.name.toLowerCase() == name) {
				sExists = cd.third;
				sPath = "third";
			}
			if (sad.third.name.toLowerCase() == newName.toLowerCase()) {
				alert = true;
			}
			if (alert) return send("There's already a server addon with that name!");
			if (sPath) {
				sad[sPath] = cd[path];
				guildData.serveraddons = sad;
				await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
			}
		}

		userData.addons.customaddons = cd;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);

		send(`You changed your addon's name from \`${name}\` to \`${newName}\`!`);
	}
};