const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "addresponse",
	description: "Add a response to one of your custom addons!",
	argument: "The name of the addon, and the response",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["createresponse"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!addresponse <addon name> <response>`" });

		let name = args[0];
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let unedited = args.slice(1).join(" ");
		let response = unedited.charAt(0).toUpperCase() + unedited.slice(1);
		if (response.length > 300) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That response is too long!" });

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
		if (!responses) responses = [];
		responses.push(response);
		cd[path]["responses"] = responses;

		let sent = `You added \`${response}\` to \`${name}\`!\nIt now has **${responses.length}** responses!`;
		if (Math.random() * 10 > 9) sent = sent + "\n(Tip: use {cents} inside your addons to replace it with the amount of cents the user has! Use `c!addoninputs` to see all of the values you can include!)";
		send.sendChannel({ channel: message.channel, author: message.author }, { content: sent });

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
				await firebase.doc(`/guilds/${message.guild.id}`).set(guildData);
			}
		}

		userData.addons.customaddons = cd;

		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};