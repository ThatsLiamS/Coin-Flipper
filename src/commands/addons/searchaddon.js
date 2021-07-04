const checkGuild = require("../../tools/checkGuild");
module.exports = {
	name: "searchaddon",
	description: "Search the addon for a specific query!",
	argument: "The name of the addon you want to search, and the query (all addons that match or include it will show up)",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["search"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send("You need to specify the name of the addon you want to search!");
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

		let query = args.slice(1).join(" ");
		if (!query) return send("You need to specify what you want to search for!");
		let matching = [];

		let next = 1;
		for (let response of exists.responses) {
			if (response.toLowerCase().includes(query)) matching.push(`Response ${next}: \`${response}\``);
			next++;
		}

		let length = matching.length;
		if (length === 0) matching = "None";

		let embed = new discord.MessageEmbed()
			.setTitle(`Found ${length} responses that match that!`)
			.setDescription(`You searched for: \`${query}\``)
			.addField("Matching responses:", matching)
			.setColor("#ffaa00");
		send(embed);
	}
};