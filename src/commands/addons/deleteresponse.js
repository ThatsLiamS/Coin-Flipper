const checkGuild = require("../../tools/checkGuild");
const admin = require("firebase-admin");
module.exports = {
	name: "deleteresponse",
	description: "Delete a response from a custom addon",
	argument: "The addon name, and the response number",
	perms: "",
	tips: "Custom addons have to be enabled to use this, and you ahve to specify the response *number*, not name.",
	aliases: ["removeresponse"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send("Phrase the command like this: `c!deleteresponse <addon name> <response number>`");

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

		name = exists.name;

		let responses = cd[path]["responses"];
		if (!responses) return send("You have no responses!");

		let responseNum = Number(args[1]);
		let index = responseNum - 1;

		let response = responses[index];
		if (!response) return send("That's not a valid response number!\nNote: Make sure to specify the response *number*, for example 1 for the 1st response");

		responses.splice(index, 1);

		if (responses.length == 0) {
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
					await firestore.doc(`/guilds/${msg.guild.id}`).update({ [`serveraddons.${sPath}.responses`]: admin.firestore.FieldValue.delete() });
				}
			}
			await firestore.doc(`/users/${msg.author.id}`).update({ [`addons.customaddons.${path}.responses`]: admin.firestore.FieldValue.delete() });
		}
		else {
			if (exists.serveraddon === true) {
				let sExists = false;
				let sPath = false;
				let guildData = guilddata.data();
				let sad = guildData.serveraddons;
				if (sad.first.name.toLowerCase() == name) {
					sExists = cd.first;
					sPath = "first";
				}
				if (sad.second.name.toLowerCase() == name) {
					sExists = cd.second;
					sPath = "second";
				}
				if (sad.third.name.toLowerCase() == name) {
					sExists = cd.third;
					sPath = "third";
				}
				if (sPath) {
					sad[sPath]["responses"] = responses;
					guildData.serveraddons = sad;
					await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
				}
			}
			cd[path]["responses"] = responses;
			userData.addons.customaddons = cd;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
		}

		send(`You deleted \`${response}\` from \`${name}\`!\nIt now has **${responses.length}** responses!`);
	}
};