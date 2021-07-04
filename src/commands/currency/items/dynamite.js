const achievementAdd = require("../../../tools/achievementAdd");

module.exports = {
	name: "dynamite",
	description: "Blow up the chat with your dynamite!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	cooldown: 1000,
	cooldowny: "1 second",
	tips: "",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let dynamite = userData.inv.dynamite;
		if (dynamite === undefined) dynamite = 0;
		if (dynamite < 1) return send("Uhh idk if you noticed but you don't have dynamite");
		let embed = new discord.MessageEmbed()
			.setTitle(`KABOOM`)
			.setDescription("You got 250 cents!")
			.setImage("https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif")
			.setColor("RED");
		userData.currencies.cents = Number(userData.currencies.cents) + Number(250);
		userData = await achievementAdd(userData, "kaboom");
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(embed);
	}
};