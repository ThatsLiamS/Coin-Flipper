const checkGuild = require("../../tools/checkGuild");

module.exports = {
	name: "addserveraddon",
	description: "Add a server addon!",
	argument: "The name of the addon you want to add!",
	perms: "",
	tips: "Custom addons have to be enabled to use this, and anyone in a server can use the server's server addons",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (!msg.member.hasPermission('MANAGE_GUILD')) return send("Sorry, only users with the Manage Server permission can use this command!");

		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let guildData = guilddata.data();
		if (guildData.serveraddons === undefined) {
			guildData.serveraddons = {
				first: {
					name: "none",
					description: "none",
					published: false,
					author: 0
				},
				second: {
					name: "none",
					description: "none",
					published: false,
					author: 0
				},
				third: {
					name: "none",
					description: "none",
					published: false,
					author: 0
				}
			};
		}

		let name = args[0];
		if (!name) return send("You need to specify the name of the addon you want to add! (it has to be one of your custom addons)");
		if (name == "none") return send("That's not a valid addon!");

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		if (cd.first.name.toLowerCase() == name) {
			exists = cd.first;
		}
		if (cd.second.name.toLowerCase() == name) {
			exists = cd.second;
		}
		if (cd.third.name.toLowerCase() == name) {
			exists = cd.third;
		}

		if (exists == false) return send("That's not a valid addon!");

		let sad = guildData.serveraddons;
		let path = false;
		if (sad.first.name == "none") path = "first";
		else if (sad.second.name == "none") path = "second";
		else if (sad.third.name == "none") path = "third";
		if (path == false) return send("You already have 3 server addons! You have to delete one using `c!deleteserveraddon` to make space for another one!");

		exists.serveraddon = true;
		sad[path] = exists;
		guildData.serveraddons = sad;

		await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You added the server addon \`${exists.name}\`!\nNote: anyone in this server can use that addon now`);
	}
};