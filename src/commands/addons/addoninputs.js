const Discord = require('discord.js');

const badgeEmotes = require(`${__dirname}/../../tools/badgeEmotes`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "badges",
	description: "Get a list of addon inputs you can use!",
	argument: "None",
	perms: "Embed Links",
	tips: "Different badges will show depending on which badges you have. For example, if you have the wealthy badge, it'll show the millionaire badge in it's place.",
	aliases: ["inputlist"],
	execute: async function(message, args, prefix, client, [, data]) {

		let badgeData = data.data().badges;
		let badgeList = ["support", "flip", "minigame", "register", "collector", "rich", "niceness"];
		let oldBadges = [`${badgeEmotes.supporter} Supporter`, `${badgeEmotes.flipper} Flipper`, `${badgeEmotes.gamer} Gamer`, `${badgeEmotes.registered} Registered`, `${badgeEmotes.collector} Collector`, `${badgeEmotes.wealthy} Wealthy`, `${badgeEmotes.niceness} Niceness`];
		let newBadges = [``, `${badgeEmotes.avid_flipper} Avid Flipper`, `${badgeEmotes.pro_gamer} Pro Gamer`, ``, `${badgeEmotes.scavenger} Scavenger`, `${badgeEmotes.millionaire} Millionaire`, ``];
		let oldDescs = ["Use `c!support` to go to the support server, and then use `c!claim supporter`", "Flip your coin 100 times, and then use `c!claim flipper`", "Win 20 minigames, and then use `c!claim gamer`", "Get a register, and then use `c!claim registered`", "Have 20 items in your inventory, and then use `c!claim collector`", "Have 100,000 cents, and then use `c!claim wealthy`", "Give at least 5 different users a total of 100,000 cents!"];
		let newDescs = ["", "Flip your coin 500 times, and then use `c!claim avid flipper`", "Win 50 minigames, and then use `c!claim pro gamer`", "", "Have 50 items in your inventory, and then use `c!claim scavenger`", "Have 1 million cents, and then use `c!claim millionaire`"];
		let badges = [];

		for (const item of badgeList) {
			if(badgeData[item] == true && newBadges[badgeList.indexOf(item)] != "") {
				badges.push({
					name: newBadges[badgeList.indexOf(item)], desc: newDescs[badgeList.indexOf(item)]
				});
			}
			else {
				badges.push({
					name: oldBadges[badgeList.indexOf(item)], desc: oldDescs[badgeList.indexOf(item)]
				});
			}
		}
		const embed = new Discord.MessageEmbed()
			.setTitle("Badges:")
			.setDescription("Important Note: none of these badges do anything lol")
			.addField("Exclusive Badges", `${badgeEmotes.developer} Developer: Be on the Coin Flipper Development Team\n${badgeEmotes.partnered_dev} Partnered Dev: Partner your botwith Coin Flipper (you need at least 350 servers)\n${badgeEmotes.bug_hunter} Bug Hunter: Find a bug in the bot and report it\n${badgeEmotes.bug_poacher} Bug Poacher: Find 5 bugs in the bot and report them\n\n${badgeEmotes.gold_tier} Gold Tier: Purchase **Coin Flipper Gold**\n${badgeEmotes.platinum_tier} Platinum Tier: Purchase **Coin Flipper Platinum**`)
			.setColor("#54fff1")
			.setFooter("Use c!claim <badge> to claim a badge!");

		for(let x = 0; x < 7; x++) {
			embed.addField(badges[x].name, badges[x].desc, true);
		}

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};