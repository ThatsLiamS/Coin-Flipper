const checkGuild = require("../../tools/checkGuild");
const profanityCheckAddon = require("../../tools/profanities").profanityCheckAddon;
module.exports = {
	name: "checkaddon",
	description: "Check a custom addon you have for profanities!",
	argument: "Required: the name of the addon\nOptional: `Separate`",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this, and using `Separate` as a 2nd argument only shows the number of responses instead of all of them",
	aliases: ["check", "checkprofanity", "checkprofanities", "profanitycheck", "profanitiescheck"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;

		let name = args[0];
		if (!name) return send("You need to specify the name of the addon you want to check!");
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

		let places = profanityCheckAddon(exists, false);
		if (!places.length) {
			let embed = new discord.MessageEmbed()
				.setTitle("✨ Squeaky clean!")
				.setDescription("Your addon has no profanities!")
				.setColor("GREEN");
			return send(embed);
		}
		else {
			let embed = new discord.MessageEmbed()
				.setTitle(`Your addon has ${places.length} profanities!`)
				.setDescription(places)
				.setColor("RED");
			return send(embed);
		}
	}
};