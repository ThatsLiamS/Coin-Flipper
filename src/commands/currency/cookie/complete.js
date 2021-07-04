module.exports = {
	name: "complete",
	description: "Complete your cookie journey and get a code for the bot!",
	argument: "None",
	perms: "",
	tips: "You need a cookie to use this",
	aliases: ["claimcode", "claimcookie", "reward", "rewardcode", "cookieclaim"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (data.data().inv.cookie < 1) return send("You don't have a cookie :/");
		let userData = data.data();
		let cookies = userData.currencies.cookies;
		if (cookies == null || cookies == undefined) cookies = 0;
		if (cookies < 200) {
			send(`By getting 200 cookies here, you can get some cookies in CookieBot, our partner (use \`c!use cookie\`)! You need ${200 - cookies} more!`);
		}
		else {
			if (userData.currencies.cookieClaimed == true) return send("You already claimed your reward!");
			try {
				await msg.author.send("The code is `huh`\n\nUse `.redeem` in CookieBot to claim your reward!\nhttps://top.gg/bot/789327073663516673");
				userData.currencies.cookieClaimed = true;
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
			}
			catch {
				msg.reply("please enable DMs so I can send you the code!");
			}
		}
	}
};