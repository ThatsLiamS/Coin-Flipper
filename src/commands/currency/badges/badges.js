const badgeEmotes = require("../../../tools/badgeEmotes");
const achievementAdd = require("../../../tools/achievementAdd");
module.exports = {
	name: "badges",
	description: "Get a list of badges that you can get!",
	argument: "None",
	perms: "Embed Links, Use External Emojis",
	tips: "Different badges will show depending on which badges you have. For example, if you have the wealthy badge, it'll show the millionaire badge in it's place.",
	aliases: ["badgelist"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let badgeData = data.data().badges;
		let badgeList = ["support", "flip", "minigame", "register", "collector", "rich", "niceness"];
		let oldBadges = [`${badgeEmotes.supporter} Supporter`, `${badgeEmotes.flipper} Flipper`, `${badgeEmotes.gamer} Gamer`, `${badgeEmotes.registered} Registered`, `${badgeEmotes.collector} Collector`, `${badgeEmotes.wealthy} Wealthy`, `${badgeEmotes.niceness} Niceness`];
		let newBadges = [``, `${badgeEmotes.avid_flipper} Avid Flipper`, `${badgeEmotes.pro_gamer} Pro Gamer`, ``, `${badgeEmotes.scavenger} Scavenger`, `${badgeEmotes.millionaire} Millionaire`, ``];
		let oldDescs = ["Use `c!support` to go to the support server, and then use `c!claim supporter`", "Flip your coin 100 times, and then use `c!claim flipper`", "Win 20 minigames, and then use `c!claim gamer`", "Get a register, and then use `c!claim registered`", "Have 20 items in your inventory, and then use `c!claim collector`", "Have 100,000 cents, and then use `c!claim wealthy`", "Give at least 5 different users a total of 100,000 cents!"];
		let newDescs = ["", "Flip your coin 500 times, and then use `c!claim avid flipper`", "Win 50 minigames, and then use `c!claim pro gamer`", "", "Have 50 items in your inventory, and then use `c!claim scavenger`", "Have 1 million cents, and then use `c!claim millionaire`"];
		let badges = [];
		for (let item of badgeList) {
			if (badgeData[item] == true && newBadges[badgeList.indexOf(item)] != "") {
				badges.push({
					name: newBadges[badgeList.indexOf(item)],
					desc: newDescs[badgeList.indexOf(item)]
				});
			}
			else {
				badges.push({
					name: oldBadges[badgeList.indexOf(item)],
					desc: oldDescs[badgeList.indexOf(item)]
				});
			}
		}
		let embed = new discord.MessageEmbed()
			.setTitle("Badges:")
			.setDescription("Important Note: none of these badges do anything lol")
			.addFields(
				{ name: badges[0].name, value: badges[0].desc, inline: true },
				{ name: badges[1].name, value: badges[1].desc, inline: true },
				{ name: badges[2].name, value: badges[2].desc, inline: true },
				{ name: badges[3].name, value: badges[3].desc, inline: true },
				{ name: badges[4].name, value: badges[4].desc, inline: true },
				{ name: badges[5].name, value: badges[5].desc, inline: true },
				{ name: badges[6].name, value: badges[6].desc, inline: true }
			)
			.addField("Exclusive Badges", `${badgeEmotes.developer} Developer: Be on the Coin Flipper Development Team\n${badgeEmotes.partnered_dev} Partnered Dev: Partner your botwith Coin Flipper (you need at least 350 servers)\n${badgeEmotes.bug_hunter} Bug Hunter: Find a bug in the bot and report it\n${badgeEmotes.bug_poacher} Bug Poacher: Find 5 bugs in the bot and report them\n\n${badgeEmotes.gold_tier} Gold Tier: Purchase **Coin Flipper Gold**\n${badgeEmotes.platinum_tier} Platinum Tier: Purchase **Coin Flipper Platinum**`)
			.setColor("#54fff1")
			.setFooter("Use c!claim <badge> to claim a badge!\nThanks to X-Boy742#8981 for making these badges!");
		send(embed);

		let userData = data.data();
		if (userData.badges.support && userData.badges.flip && userData.badges.flip_plus && userData.badges.minigame && userData.badges.minigame_plus && userData.badges.register && userData.badges.collector && userData.badges.collector_plus && userData.badges.rich && userData.badges.rich_plus && userData.badges.niceness) {
			let localData = await achievementAdd(userData, "badgeCollection", true);
			if (localData) {
				userData = localData;
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
			}
		}
	}
};