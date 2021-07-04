module.exports = {
	name: "trophy",
	description: "Flex your trophy on everyone!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	tips: "",
	aliases: ["flex"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (data.data().inv.goldtrophy < 1) return send("You can't flex a trophy that you don't have :/");
		let embed = new discord.MessageEmbed()
			.setTitle(`${msg.author.username} flexes on all of you!`)
			.setImage("https://imgur.com/iqooiDn.jpg")
			.setColor("YELLOW");
		send(embed);
	}
};