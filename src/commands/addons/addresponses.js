const checkGuild = require("../../tools/checkGuild");
module.exports = {
	name: "addresponses",
	description: "Add two or more responses to one of your custom addons!",
	argument: "The name of the addon, and each response, separated by commas",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["createresponses"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send("Phrase the command like this: `c!addresponse <addon name> <response>`");

		let name = args[0];
		if (name == "none") return send("That's an invalid addon name!");

		let unedited = args.slice(1).join(" ");
		let responsesUnedited = unedited.split(",");
		if (responsesUnedited.length < 2) return send("You need to add at least 2 responses! (separate them with commas)");
		let responses = responsesUnedited.map(item => item.charAt(0).toUpperCase() + item.slice(1));

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

		name = exists.name;

		let addonResponses = cd[path]["responses"];
		if (!addonResponses) addonResponses = [];
		let yep = false;
		for (let ree of responses) {
			addonResponses.push(ree);
			if (ree.length > 300) yep = true;
		}
		if (yep) return send("One or more of those responses are too long!");
		cd[path]["responses"] = addonResponses;

		let sent = `You added \`${responses.length}\` responses to \`${name}\`!\nIt now has **${addonResponses.length}** responses!`;
		send(sent);

		if (exists.serveraddon === true) {
			let sExists = false;
			let sPath = false;
			let guildData = guilddata.data();
			let sad = guildData.serveraddons;
			if (sad.first.name.toLowerCase() == name) {
				sExists = sad.first;
				sPath = "first";
			}
			if (sad.second.name.toLowerCase() == name) {
				sExists = sad.second;
				sPath = "second";
			}
			if (sad.third.name.toLowerCase() == name) {
				sExists = sad.third;
				sPath = "third";
			}
			if (sPath) {
				sad[sPath] = cd[path];
				guildData.serveraddons = sad;
				await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
			}
		}

		userData.addons.customaddons = cd;

		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};