const checkGuild = require("../../tools/checkGuild");
module.exports = {
	name: "disable",
	description: "Disable a feature in your server!",
	argument: "The feature you want to disable",
	perms: "",
	tips: "you need the Manage Server permission to use this",
	aliases: ["disablefeature"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (!msg.member.hasPermission('MANAGE_GUILD')) return send("Sorry, only users with the Manage Server permission can use this command!");
		if (!args[0]) return send("Sorry, you need to specify something that you want to disable.\nList: `flipping`, `minigames`, `publiccreate`, `trash`, `karate`, `customaddons`, `online`");
		let feature = args[0];
		let featureList = ["flipping", "minigames", "publiccreate", "trash", "karate", "customaddons", "online", "trading"];
		if (!featureList.includes(feature)) return send("That's not a valid feature! (use `c!help customization` for more info");
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		let guildData = guilddata.data();
		// if (guildData["enabled"][feature] == false) return send("That feature is already disabled!");
		guildData["enabled"][feature] = false;
		await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
		send(`You disabled **${feature}**!`);
	}
};