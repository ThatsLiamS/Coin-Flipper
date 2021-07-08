const badgeEmotes = require(`${__dirname}/../../../tools/badgeEmotes`);
const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "claim",
	description: "Claim a badge if you meet the requirement!",
	argument: "The badge you want to claim",
	perms: "Use External Emojis",
	tips: "Some badges, such as the developer badge, cannot be claimed!",
	aliases: ["claimbadge", "getbadge"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify which badge to claim! (use `c!badges`)" });
		let claimed = args.slice(0).join(" ");
		if (claimed == "support") claimed = "supporter";

		let badgeLocalIds = ["supporter", "flipper", "avid flipper", "gamer", "pro gamer", "registered", "collector", "scavenger", "wealthy", "millionaire"];
		if (!badgeLocalIds.includes(claimed)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That isn't a valid badge (if you're trying to claim the dev or bug hunter badge, use `c!badges` to see how to get them" });

		let userData = data.data();
		let badgeLocal = [`${badgeEmotes.supporter} Supporter`, `${badgeEmotes.flipper} Flipper`, `${badgeEmotes.avid_flipper} Avid Flipper`, `${badgeEmotes.gamer} Gamer`, `${badgeEmotes.pro_gamer} Pro Gamer`, `${badgeEmotes.registered} Registered`, `${badgeEmotes.collector} Collector`, `${badgeEmotes.scavenger} Scavenger`, `${badgeEmotes.wealthy} Wealthy`, `${badgeEmotes.millionaire} Millionaire`];
		let totalItems = (userData.inv.bronzecoin + userData.inv.silvercoin + userData.inv.goldcoin + userData.inv.kcoin + userData.inv.golddisk + userData.inv.platinumdisk + userData.inv.calendar + userData.inv.goldtrophy + userData.inv.luckypenny + userData.inv.vault + userData.inv.packages + userData.inv.compass + userData.inv.broken8ball + userData.inv.key + userData.inv.bandaid + userData.inv.soap + userData.inv.fuel + userData.inv.briefcases);

		let conditionals = [(message.guild.id != 832245298578849822), (userData.stats.flipped < 100), (userData.stats.flipped < 300), (userData.stats.minigames_won < 20), (userData.stats.minigames_won < 50), (userData.inv.key < 1), (totalItems < 20), (totalItems < 50), (userData.currencies.cents < 100000), (userData.currencies.cents < 1000000)];
		let dataIds = ["support", "flip", "flip_plus", "minigame", "minigame_plus", "register", "collector", "collector_plus", "rich", "rich_plus"];

		let badge = badgeLocal[badgeLocalIds.indexOf(claimed)];
		let conditional = conditionals[badgeLocal.indexOf(badge)];
		if (conditional) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you don't have the requirement to get that badge! (use `c!badges` to see the requirement)" });
		let dataBadge = dataIds[badgeLocal.indexOf(badge)];

		let badgeAmt = userData["badges"][dataBadge];
		if (badgeAmt == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have that badge!" });

		userData["badges"][dataBadge] = true;
		if (userData.badges.support && userData.badges.flip && userData.badges.flip_plus && userData.badges.minigame && userData.badges.minigame_plus && userData.badges.register && userData.badges.collector && userData.badges.collector_plus && userData.badges.rich && userData.badges.rich_plus && userData.badges.niceness) {
			userData = await achievementAdd(userData, "badgeCollection");
		}
		await firebase.doc(`/users/${message.author.id}`).set(userData);
		send.sendChannel({ channel: message.channel, author: message.author }, { content:`You got the ${badge} badge!` });

	}
};