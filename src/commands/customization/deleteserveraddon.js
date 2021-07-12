const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "deleteserveraddon",
	description: "Delete a server addon!",
	argument: "The name of the addon you want to delete!",
	perms: "",
	aliases: ["removeserveraddon"],
	tips: "Custom addons have to be enabled to use this",
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
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify the name of the addon you want to delete! (it has to be one of your server addons)" });
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		let sad = guildData.serveraddons;

		let exists = false;
		let path = false;
		if (sad.first.name.toLowerCase() == name) {
			exists = sad.first;
			path = "first";
		}
		if (sad.second.name.toLowerCase() == name) {
			exists = sad.second;
			path = "second";
		}
		if (sad.third.name.toLowerCase() == name) {
			exists = sad.third;
			path = "third";
		}

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		exists.serveraddon = false;
		sad[path] = {
			name: "none",
			description: "none",
			published: false,
			author: 0
		};
		guildData.serveraddons = sad;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let uExists = false;
		let uPath = false;
		if (cd.first.name.toLowerCase() == name) {
			uExists = cd.first;
			uPath = "first";
		}
		if (cd.second.name.toLowerCase() == name) {
			uExists = cd.second;
			uPath = "second";
		}
		if (cd.third.name.toLowerCase() == name) {
			uExists = cd.third;
			uPath = "third";
		}

		uExists.serveraddon = false;
		cd[uPath] = uExists;
		userData.addons.customaddons = cd;

		await firebase.doc(`/guilds/${message.guild.id}`).set(guildData);
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You deleted the server addon \`${exists.name}\`!` });

	}
};