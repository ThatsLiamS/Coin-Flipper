const checkGuild = require("../../tools/checkGuild");
const checkOnline = require("../../tools/checkOnline");
module.exports = {
	name: "market",
	description: "View the CoinTopia Market!",
	argument: "None",
	perms: "Embed Links",
	tips: "Online has to be enabled to use this",
	aliases: ["onlinemarket", "onlineshop", "cointopiamarket", "cointopiashop", "specialshop"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();

		let array = await checkOnline(firestore, msg.author.id, userData);
		userData = array[1];
		let online = array[0];
		if (online == false) return;

		let embed = new discord.MessageEmbed()
			.setTitle("CoinTopia Market")
			.setDescription("Use `c!buy <item>` to buy something!")
			.addField("🏷️ Label", "`Cost:` 2000 cents `Usage:` increase your register percent by 10%!\n`Description:` a nice label that can convince people to give more money")
			.addField("🎙️ Microphone", "`Cost:` 1000 cents `Usage:` get a custom address\n`Description:` a microphone that can help you express yourself better in Cointopia")
			.addField("💳 Gold Card", "`Cost:` 500 cents `Usage:` allows you to add a coin to the CoinTopia Tower\n`Description:` a glittering gold card that allows you entryway to the tower")
			.addField("📋 Clipboard", "`Cost:` 250 cents `Usage:` get 1.5x more cents when working\n`Description:` a clipboard that will surely help you work better ||hopefully||")
			.setFooter("Ultra Donators get everything 25% off!")
			.setColor("#ad61ff");

		send(embed);
	}
};