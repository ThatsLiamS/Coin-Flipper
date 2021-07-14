const Discord = require('discord.js');

const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "karate",
	aliases: ["stats"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		let beltColor = kd.belt;
		let embedColor = beltColor.toUpperCase();

		if (beltColor == "white") embedColor = "#C0C0C0";
		if (beltColor == "brown") embedColor = "#785200";

		let myAbilities = kd.abilities;
		const abilityList = ["flip", "spin", "slide", "dive", "swipe", "slice"];
		let abilities = "";

		for (const item of abilityList) {
			if (myAbilities[item] == true) {
				if (abilities == "") {
					abilities = item.charAt(0).toUpperCase() + item.slice(1);
				}
				else {
					abilities = abilities + `\n${item.charAt(0).toUpperCase() + item.slice(1)}`;
				}
			}
		}

		if (abilities == "") abilities = "You have no abilities!";
		const embed = new Discord.MessageEmbed()
			.setTitle(kd.name)
			.addField("Type", kd.type)
			.addFields(
				{ name: "XP", value: kd.xp, inline: true },
				{ name: "Level", value: kd.level, inline: true }
			)
			.addField("Battles Won", userData.stats.timesWon)
			.addField("Abilities", abilities)
			.setColor(embedColor);

		if (kd.level >= 16) {
			if (kd.level < 27) {
				let localData = await achievementAdd(userData, "blackBelt", true);
				if (localData) {
					userData = localData;
					await firebase.doc(`/users/${message.author.id}`).set(userData);
				}
			}
			else {
				let localData = await achievementAdd(userData, "theMaster", true);
				if (localData) {
					userData = localData;
					await firebase.doc(`/users/${message.author.id}`).set(userData);
				}
			}
		}

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};