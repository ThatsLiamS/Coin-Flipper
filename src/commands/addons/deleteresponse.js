const admin = require("firebase-admin");

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "deleteresponse",
	description: "Delete a response from a custom addon",
	argument: "The addon name, and the response number",
	perms: "",
	tips: "Custom addons have to be enabled to use this, and you ahve to specify the response *number*, not name.",
	aliases: ["removeresponse"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!deleteresponse <addon name> <response number>`" });

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

		name = exists.name;

		let responses = cd[path]["responses"];
		if (!responses) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You have no responses!" });

		let responseNum = Number(args[1]);
		let index = responseNum - 1;

		let response = responses[index];
		if (!response) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid response number!\nNote: Make sure to specify the response *number*, for example 1 for the 1st response" });

		responses.splice(index, 1);

		if (responses.length == 0) {
			if (exists.serveraddon === true) {
				let sPath = false;
				let guildData = guilddata.data();
				let sad = guildData.serveraddons;
				if (sad.first.name.toLowerCase() == name) {
					sPath = "first";
				}
				if (sad.second.name.toLowerCase() == name) {
					sPath = "second";
				}
				if (sad.third.name.toLowerCase() == name) {
					sPath = "third";
				}
				if (sPath) {
					sad[sPath] = cd[path];
					guildData.serveraddons = sad;
					await firebase.doc(`/guilds/${message.guild.id}`).update({ [`serveraddons.${sPath}.responses`]: admin.firestore.FieldValue.delete() });
				}
			}
			await firebase.doc(`/users/${message.author.id}`).update({ [`addons.customaddons.${path}.responses`]: admin.firestore.FieldValue.delete() });
		}
		else {
			if (exists.serveraddon === true) {
				let sPath = false;
				let guildData = guilddata.data();
				let sad = guildData.serveraddons;
				if (sad.first.name.toLowerCase() == name) {
					sPath = "first";
				}
				if (sad.second.name.toLowerCase() == name) {
					sPath = "second";
				}
				if (sad.third.name.toLowerCase() == name) {
					sPath = "third";
				}
				if (sPath) {
					sad[sPath]["responses"] = responses;
					guildData.serveraddons = sad;
					await firebase.doc(`/guilds/${message.guild.id}`).set(guildData);
				}
			}
			cd[path]["responses"] = responses;
			userData.addons.customaddons = cd;
			await firebase.doc(`/users/${message.author.id}`).set(userData);
		}

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You deleted \`${response}\` from \`${name}\`!\nIt now has **${responses.length}** responses!` });
	}
};