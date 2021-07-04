const checkGuild = require("../../tools/checkGuild");
module.exports = {
	name: "enable",
	description: "Enable a feature in your server!",
	argument: "The feature you want to enable",
	perms: "",
	tips: "You need the Manage Server permission to use this",
	aliases: ["enablefeature"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (!msg.member.hasPermission('MANAGE_GUILD')) return send("Sorry, only users with the Manage Server permission can use this command!");
		let featureList = ["flipping", "minigames", "publiccreate", "trash", "karate", "customaddons", "online", "trading"];
		if (!args[0]) return send(`Sorry, you need to specify something that you want to enable.\nList: \`${featureList.join(", ")}\``);
		let feature = args[0];
		if (!featureList.includes(feature)) return send("That's not a valid feature! (use `c!help customization` for more info");
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		let guildData = guilddata.data();
		// if (guildData["enabled"][feature] == true) return send("That feature is already enabled!");
		guildData["enabled"][feature] = true;
		await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
		send(`You enabled **${feature}**!`);
	}
};