const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
const profanityCheckAddon = require("../../../tools/profanities").profanityCheckAddon;
const achievementAdd = require("../../../tools/achievementAdd");
const admin = require("firebase-admin");

module.exports = {
	name: "publishaddon",
	description: "Publish one of your custom addons to the worldwide Addon Shop!",
	argument: "The name of the addon",
	perms: "",
	tips: "Online and custom addons have to be enabled to use this",
	aliases: ["publish"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0]) return send("Phrase the command like this: `c!publish <addon name>`");

		let name = args[0];
		if (name == "none") return send("That's an invalid addon name!");

		let exists = false;
		let path = false;
		if (cd.first.name.toLowerCase() == name) {
			exists = cd.first;
			path = "first";
		}
		if (cd.second.name.toLowerCase() == name) {
			exists = cd.second;
			path = "second";
		}
		if (cd.third.name.toLowerCase() == name) {
			exists = cd.third;
			path = "third";
		}

		if (exists == false) return send("That's an invalid addon name!");

		let addondata = await firestore.doc(`/online/addons`).get();
		let addonData = addondata.data();
		let addons = addonData.addons;

		if (!addons) return send("That's an invalid addon name!");

		let aexists = false;
		for (let addon of addons) {
			if (addon.name.toLowerCase() == name) {
				aexists = addon;
			}
		}

		if (aexists != false && exists.published == false) return send("There's already an addon on the addon shop with that name! Please rename your addon using `c!renameaddon`");

		if (profanityCheckAddon(exists) == true) return send("Your addon has a profanity in it! Use `c!checkaddon <addon>` to find out where!");

		if (exists.published == true) {

			if (exists.description == "") return send("You need to set a description for your addon! To do that use `c!setdescription`");
			if (exists.cost == 0) return send("You need to set a cost that's at least 1 cent for your addon! To do that use `c!setcost`");
			let huh = false;
			if (exists.responses) {
				if (exists.responses.length < 10) huh = true;
			}
			else {
				huh = true;
			}
			if (huh == true) return send("You need at least 10 responses in your addon!");

			let array = await checkOnline(firestore, msg.author.id, userData);
			userData = array[1];
			let online = array[0];

			if (online == false) return;

			cd[path]["author"] = msg.author.tag;
			exists.author = msg.author.tag;

			let addonOnline = addons.find(addon => addon.name.toLowerCase() == name);
			let index = addons.indexOf(addonOnline);
			addons[index] = exists;
			addonData.addons = addons;
			await firestore.doc(`/online/addons`).set(addonData);

			userData.addons.customaddons = cd;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);

			send(`You updated your addon **${exists.name}**!`);

		}
		else {

			if (exists.description == "") return send("You need to set a description for your addon! To do that use `c!setdescription`");
			if (exists.cost == 0) return send("You need to set a cost that's at least 1 cent for your addon! To do that use `c!setcost`");
			let huh = false;
			if (exists.responses) {
				if (exists.responses.length < 10) huh = true;
			}
			else {
				huh = true;
			}
			if (huh == true) return send("You need at least 10 responses in your addon!");

			let array = await checkOnline(firestore, msg.author.id, userData);
			userData = array[1];
			let online = array[0];

			if (online == false) return;

			cd[path]["published"] = true;
			cd[path]["author"] = msg.author.tag;
			cd[path]["authorId"] = msg.author.id;
			exists.published = true;
			exists.author = msg.author.tag;
			exists.authorId = msg.author.id;
			userData = await achievementAdd(userData, "toTheWorld");

			await firestore.doc(`/online/addons`).update({ "addons": admin.firestore.FieldValue.arrayUnion(exists) });

			userData.addons.customaddons = cd;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);

			send(`You published your addon **${name}**! 🎉`);

		}
	}
};