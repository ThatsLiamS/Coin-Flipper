const achievementAdd = require("../../../tools/achievementAdd");
module.exports = {
	name: "karate",
	aliases: ["stats"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd) {
		let userData = data.data();
		let beltColor = kd.belt;
		let embedColor = beltColor.toUpperCase();
		if (beltColor == "white") embedColor = "#C0C0C0";
		if (beltColor == "brown") embedColor = "#785200";
		let myAbilities = kd.abilities;
		let abilityList = ["flip", "spin", "slide", "dive", "swipe", "slice"];
		let abilities = "";
		for (let item of abilityList) {
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
		let embed = new discord.MessageEmbed()
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
					await firestore.doc(`/users/${msg.author.id}`).set(userData);
				}
			}
			else {
				let localData = await achievementAdd(userData, "theMaster", true);
				if (localData) {
					userData = localData;
					await firestore.doc(`/users/${msg.author.id}`).set(userData);
				}
			}
		}

		send(embed);
	}
};