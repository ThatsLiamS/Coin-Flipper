const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "complete",
	description: "Complete your cookie journey and get a code for the bot!",
	argument: "None",
	perms: "",
	tips: "You need a cookie to use this",
	aliases: ["claimcode", "claimcookie", "reward", "rewardcode", "cookieclaim"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (data.data().inv.cookie < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have a cookie :/" });
		let userData = data.data();

		let cookies = userData.currencies.cookies;
		if (cookies == null || cookies == undefined) cookies = 0;
		if (cookies < 200) {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: `By getting 200 cookies here, you can get some cookies in CookieBot, our partner (use \`c!use cookie\`)! You need ${200 - cookies} more!` });
		}
		else {
			if (userData.currencies.cookieClaimed == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already claimed your reward!" });
			try {
				await send.sendUser(message.author, { content: "The code is `huh`\n\nUse `.redeem` in CookieBot to claim your reward!\nhttps://top.gg/bot/789327073663516673" });
				userData.currencies.cookieClaimed = true;
				await firebase.doc(`/users/${message.author.id}`).set(userData);
			}
			catch {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "please enable DMs so I can send you the code!" });
			}
		}
		return;
	}
};