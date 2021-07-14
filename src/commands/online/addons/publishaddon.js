const admin = require("firebase-admin");

const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../../tools/checkOnline`);
const profanityCheckAddon = require(`${__dirname}/../../../tools/profanities`).profanityCheckAddon;
const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "publishaddon",
	description: "Publish one of your custom addons to the worldwide Addon Shop!",
	argument: "The name of the addon",
	perms: "",
	tips: "Online and custom addons have to be enabled to use this",
	aliases: ["publish"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!publish <addon name>`" });

		let name = args[0];
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

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

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let addondata = await firebase.doc(`/online/addons`).get();
		let addonData = addondata.data();
		let addons = addonData.addons;

		if (!addons) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let aexists = false;
		for (let addon of addons) {
			if (addon.name.toLowerCase() == name) {
				aexists = addon;
			}
		}

		if (aexists != false && exists.published == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "There's already an addon on the addon shop with that name! Please rename your addon using `c!renameaddon`" });

		if (profanityCheckAddon(exists) == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon has a profanity in it! Use `c!checkaddon <addon>` to find out where!" });

		if (exists.published == true) {

			if (exists.description == "") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to set a description for your addon! To do that use `c!setdescription`" });
			if (exists.cost == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to set a cost that's at least 1 cent for your addon! To do that use `c!setcost`" });
			let huh = false;
			if (exists.responses) {
				if (exists.responses.length < 10) huh = true;
			}
			else {
				huh = true;
			}
			if (huh == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need at least 10 responses in your addon!" });

			let array = await checkOnline(firebase, message.author.id, userData);
			userData = array[1];
			let online = array[0];

			if (online == false) return;

			cd[path]["author"] = message.author.tag;
			exists.author = message.author.tag;

			let addonOnline = addons.find(addon => addon.name.toLowerCase() == name);
			let index = addons.indexOf(addonOnline);
			addons[index] = exists;
			addonData.addons = addons;
			await firebase.doc(`/online/addons`).set(addonData);

			userData.addons.customaddons = cd;
			await firebase.doc(`/users/${message.author.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You updated your addon **${exists.name}**!` });

		}
		else {

			if (exists.description == "") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to set a description for your addon! To do that use `c!setdescription`" });
			if (exists.cost == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to set a cost that's at least 1 cent for your addon! To do that use `c!setcost`" });
			let huh = false;
			if (exists.responses) {
				if (exists.responses.length < 10) huh = true;
			}
			else {
				huh = true;
			}
			if (huh == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need at least 10 responses in your addon!" });

			let array = await checkOnline(firebase, message.author.id, userData);
			userData = array[1];
			let online = array[0];

			if (online == false) return;

			cd[path]["published"] = true;
			cd[path]["author"] = message.author.tag;
			cd[path]["authorId"] = message.author.id;
			exists.published = true;
			exists.author = message.author.tag;
			exists.authorId = message.author.id;
			userData = await achievementAdd(userData, "toTheWorld");

			await firebase.doc(`/online/addons`).update({ "addons": admin.firestore.FieldValue.arrayUnion(exists) });

			userData.addons.customaddons = cd;
			await firebase.doc(`/users/${message.author.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You published your addon **${name}**! 🎉` });

		}
	}
};