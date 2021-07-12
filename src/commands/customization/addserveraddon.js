const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "addserveraddon",
	description: "Add a server addon!",
	argument: "The name of the addon you want to add!",
	perms: "",
	tips: "Custom addons have to be enabled to use this, and anyone in a server can use the server's server addons",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (!message.member.hasPermission('MANAGE_GUILD')) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, only users with the Manage Server permission can use this command!" });

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
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
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify the name of the addon you want to add! (it has to be one of your custom addons)" });
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

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

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		let sad = guildData.serveraddons;
		let path = false;
		if (sad.first.name == "none") path = "first";
		else if (sad.second.name == "none") path = "second";
		else if (sad.third.name == "none") path = "third";
		if (path == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have 3 server addons! You have to delete one using `c!deleteserveraddon` to make space for another one!" });

		exists.serveraddon = true;
		sad[path] = exists;
		guildData.serveraddons = sad;

		await firebase.doc(`/guilds/${message.guild.id}`).set(guildData);
		await firebase.doc(`/users/${message.author.id}`).set(userData);
		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You added the server addon \`${exists.name}\`!\nNote: anyone in this server can use that addon now` });

	}
};