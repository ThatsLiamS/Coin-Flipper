const Discord = require('discord.js');

const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "addons",
	description: "Get a list of all your addons!",
	argument: "None",
	perms: "Embed Links",
	tips: "This will show a combination of built-in addons, addons you unlocked from buying addons, your custom addons, and addons you bought from the addon shop.",
	aliases: ["addonlist"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		const embed = new Discord.MessageEmbed()
			.setTitle("Flip Addons:")
			.setDescription("You can use these addons by doing the command `c!flip <addon>`\nNote that this embed may differ depending on your items and abilities")
			.addFields(
				{ name: "extra", value: "Over 100 different responses, such as 'the coin blew up' or 'the coin was pog', or 'the coin spent itself on discord nitro'", inline: true },
				{ name: "opposite", value: "The side that it lands on is opposite! (heads is tails and tails is heads)", inline: true }
			)
			.setFooter("If you want to suggest an addon, go to the support server by using c!support")
			.setColor("GREEN");

		if (data.data().inv.bronzecoin > 0) embed.addField("penny", "Has 10 bronze-related outputs");
		if (data.data().inv.silvercoin > 0) embed.addField("dime", "Has 10 silver and dime related outputs");
		if (data.data().inv.goldcoin > 0) embed.addField("dollar", "Has 10 dollar-related outputs AND gives you 1.5x more cents");
		if (data.data().inv.kcoin > 0) embed.addField("24", "Has 24 mining (some are minecraft) related outputs due to the medal having 24 karat gold AND has a 5% greater chance of getting a briefcase");
		if (data.data().karate.abilities.flip == true) embed.addField("train", "Punces and kicks - train your karate coin and level it up!");

		if (data.data().addons.customaddons.first.name.toLowerCase() != "none") {
			let desc = data.data().addons.customaddons.first.description;
			if (desc == "none" || !desc) desc = "This addon has no description";
			embed.addField(data.data().addons.customaddons.first.name, desc);
		}
		if (data.data().addons.customaddons.second.name.toLowerCase() != "none") {
			let desc = data.data().addons.customaddons.second.description;
			if (desc == "none" || !desc) desc = "This addon has no description";
			embed.addField(data.data().addons.customaddons.second.name, desc);
		}
		if (data.data().addons.customaddons.third.name.toLowerCase() != "none") {
			let desc = data.data().addons.customaddons.third.description;
			if (desc == "none" || !desc) desc = "This addon has no description";
			embed.addField(data.data().addons.customaddons.third.name, desc);
		}
		let array = await checkOnline(firebase, message.author.id, data.data());
		let userData = array[1];
		let online = array[0];
		if (online == false) return;
		let od = userData.online.addonInv;
		if (od.first.name.toLowerCase() != "none") {
			let desc = od.first.description;
			if (desc == "none") desc = "This addon has no description";
			embed.addField(od.first.name, desc);
		}
		if (od.second.name.toLowerCase() != "none") {
			let desc = od.second.description;
			if (desc == "none") desc = "This addon has no description";
			embed.addField(od.second.name, desc);
		}
		if (od.third.name.toLowerCase() != "none") {
			let desc = od.third.description;
			if (desc == "none") desc = "This addon has no description";
			embed.addField(od.third.name, desc);
		}

		if (userData.inv.bronzecoin > 0 && userData.inv.silvercoin > 0 && userData.inv.goldcoin > 0 && userData.inv.kcoin > 0 && userData.karate.abilities.flip === true) {
			let localData = await achievementAdd(userData, "addonMaster", true);
			if (localData) {
				userData = localData;
				await firebase.doc(`/users/${message.author.id}`).set(userData);
			}
		}

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

	}
};