const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "market",
	description: "View the CoinTopia Market!",
	argument: "None",
	perms: "Embed Links",
	tips: "Online has to be enabled to use this",
	aliases: ["onlinemarket", "onlineshop", "cointopiamarket", "cointopiashop", "specialshop"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();

		let array = await checkOnline(firebase, message.author.id, userData);
		userData = array[1];
		let online = array[0];
		if (online == false) return;

		const embed = new Discord.MessageEmbed()
			.setTitle("CoinTopia Market")
			.setDescription("Use `c!buy <item>` to buy something!")
			.addField("🏷️ Label", "`Cost:` 2000 cents `Usage:` increase your register percent by 10%!\n`Description:` a nice label that can convince people to give more money")
			.addField("🎙️ Microphone", "`Cost:` 1000 cents `Usage:` get a custom address\n`Description:` a microphone that can help you express yourself better in Cointopia")
			.addField("💳 Gold Card", "`Cost:` 500 cents `Usage:` allows you to add a coin to the CoinTopia Tower\n`Description:` a glittering gold card that allows you entryway to the tower")
			.addField("📋 Clipboard", "`Cost:` 250 cents `Usage:` get 1.5x more cents when working\n`Description:` a clipboard that will surely help you work better ||hopefully||")
			.setFooter("Ultra Donators get everything 25% off!")
			.setColor("#ad61ff");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};