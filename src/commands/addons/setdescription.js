const checkGuild = require("../../tools/checkGuild");
module.exports = {
	name: "setdescription",
	description: "Set a description of one of your addons!",
	argument: "The addon name, and the description",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["description", "setdesc", "desc"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send("Phrase the command like this: `c!setdescription <addon name> <new description>`");

		let name = args[0];
		if (name == "none") return send("That's an invalid addon name!");

		let unedited = args.slice(1).join(" ");
		let description = unedited.charAt(0).toUpperCase() + unedited.slice(1);
		if (description.length > 130) return send("That description is too long!");

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

		if (exists.description == description) return send("Your addon already has that description!");

		let oldDesc = exists.description;
		if (oldDesc == "") oldDesc = "No description";

		cd[path]["description"] = description;

		userData.addons.customaddons = cd;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);

		send(`You changed your addon's description from \`${oldDesc}\` to \`${description}\`!`);
	}
};