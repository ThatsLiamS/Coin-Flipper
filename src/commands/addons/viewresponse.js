const checkGuild = require("../../tools/checkGuild");
module.exports = {
	name: "viewresponse",
	description: "View a response in a custom addon you have!",
	argument: "Required: the name of the addon, and the number of the response",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this, and you must specify a response *number*",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send("You need to specify the name of the addon you want to view a response of!");
		if (name == "none") return send("That's not a valid addon!");

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

		name = exists.name;

		let responses = exists.responses;
		if (!responses) responses = [];
		let response = responses[args[1] - 1];
		if (!response) return send("That's not an existing response number!");

		let embed = new discord.MessageEmbed()
			.setTitle(`Response ${args[1]} in ${name}`)
			.setDescription(response)
			.setColor("GREEN");
		send(embed);
	}
};