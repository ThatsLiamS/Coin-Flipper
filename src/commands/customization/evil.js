const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: `evil`,
	description: "Turn on or off evil mode!",
	argument: "`On` or `Off`",
	perms: "",
	tips: "Evil mode makes the entire bot more evil and unforgiving!",
	aliases: ["evilmode", "enableevil", "disableevil"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (args[0] == "enable" || args[0] == "on") {
			let userData = data.data();
			if (userData.evil == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have evil mode enabled!" });
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "Coin Flipper **Evil Mode** is a mode that will make your experience more grueling, frustrating, and overall evil.\n\nSome things that will change:\n1. You'll never get the max amount of cents when dropshipping\n2. Addons & items that improve flipping won't count\n3. You'll get less cents in your register\n4. Even more evil things\n5. Why would people even enable this\n\nSend `yes` or `no` to confirm your choice" });
			message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 45000 }).then(async collected => {
				if (!collected.first()) {
					send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't answer :/" });
					return;
				}
				let msg = collected.first();
				msg = msg.content.toLowerCase();
				if (msg == "yes") {
					userData.evil = true;
					userData = await achievementAdd(userData, "ohNo");
					await firebase.doc(`/users/${message.author.id}`).set(userData);
					send.sendChannel({ channel: message.channel, author: message.author }, { content: "You enabled **evil mode!**" });
				}
				else {
					send.sendChannel({ channel: message.channel, author: message.author }, { content: "Good job you made the correct choice" });
				}
			});
		}
		else if (args[0] == "disable" || args[0] == "off") {
			let userData = data.data();
			if (userData.evil == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have evil mode disabled!" });
			userData.evil = false;
			await firebase.doc(`/users/${message.author.id}`).set(userData);
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "You disabled **evil mode!**" });
		}
		else { send.sendChannel({ channel: message.channel, author: message.author }, { content: "Please specify `on/off`" }); }
	}
};