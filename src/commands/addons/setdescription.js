const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "setdescription",
	description: "Set a description of one of your addons!",
	argument: "The addon name, and the description",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["description", "setdesc", "desc"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!setdescription <addon name> <new description>`" });

		let name = args[0];
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let unedited = args.slice(1).join(" ");
		let description = unedited.charAt(0).toUpperCase() + unedited.slice(1);
		if (description.length > 130) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That description is too long!" });

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

		if (exists.description == description) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon already has that description!" });

		let oldDesc = exists.description;
		if (oldDesc == "") oldDesc = "No description";

		cd[path]["description"] = description;

		userData.addons.customaddons = cd;
		await firebase.doc(`/users/${message.author.id}`).set(userData);
		send.sendChannel({ channel: message.channel, author: message.author }, { content: `Successfully changed it from: \`${oldDesc}\`; to: \`${description}\`!` });

	}
};