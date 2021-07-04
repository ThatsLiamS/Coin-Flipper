const achievements = require("../../tools/constants").achievements;
const convertToEmote = require("../../tools/convertToEmote");
module.exports = {
	name: "achievements",
	description: "View the 26 achievements you can get!",
	argument: "Optional: a page number",
	perms: "Embed Links",
	tips: "",
	aliases: ["achievement"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let hugeArray = [];
		let alreadyAdded = [];
		if (achievements.length > 5) {
			for (let item of achievements) {
				if ((achievements.indexOf(item) + 1) % 6 == 0) {
					let index = achievements.indexOf(item);
					let last1 = achievements[index - 1];
					let last2 = achievements[index - 2];
					let last3 = achievements[index - 3];
					let last4 = achievements[index - 4];
					let last5 = achievements[index - 5];
					hugeArray.push([item, last1, last2, last3, last4, last5]);
					alreadyAdded.push(last5);
					alreadyAdded.push(last4);
					alreadyAdded.push(last3);
					alreadyAdded.push(last2);
					alreadyAdded.push(last1);
					alreadyAdded.push(item);
				}
				else if (achievements.indexOf(item) == achievements.length - 1) {
					let index = achievements.indexOf(item);
					let last1 = achievements[index - 1];
					let last2 = achievements[index - 2];
					let last3 = achievements[index - 3];
					let last4 = achievements[index - 4];
					let last5 = achievements[index - 5];
					if (alreadyAdded.includes(last1)) {
						hugeArray.push([item]);
					}
					else if (alreadyAdded.includes(last2)) {
						hugeArray.push([item, last1]);
					}
					else if (alreadyAdded.includes(last3)) {
						hugeArray.push([item, last1, last2]);
					}
					else if (alreadyAdded.includes(last4)) {
						hugeArray.push([item, last1, last2, last3]);
					}
					else if (alreadyAdded.includes(last5)) {
						hugeArray.push([item, last1, last2, last3, last4]);
					}
					else {
						hugeArray.push([item, last1, last2, last3, last4, last5]);
					}
				}
			}
		}
		else {
			hugeArray = [[]];
			for (let item of achievements) {
				hugeArray[0].push(item);
			}
		}

		let page = args[0];
		if (!page) page = 1;
		let array = hugeArray[page - 1];
		if (!array) array = hugeArray[0];
		let embed = new discord.MessageEmbed();
		if (userData.achievements === undefined) userData.achievements = {};
		for (let a of array) {
			embed.addField(`${a.emoji} ${a.name}`, `${a.req}\nCompleted: ${convertToEmote(userData.achievements[a.id])}`);
		}
		embed.setTitle(`Achievements - Page ${page}/${hugeArray.length}`);
		embed.setFooter("Use \"c!achievements <page>\" to view a different page of achievements!");
		send(embed);
	}
};