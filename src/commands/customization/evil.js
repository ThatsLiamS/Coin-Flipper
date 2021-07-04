const achievementAdd = require("../../tools/achievementAdd");
module.exports = {
	name: `evil`,
	description: "Turn on or off evil mode!",
	argument: "`On` or `Off`",
	perms: "",
	tips: "Evil mode makes the entire bot more evil and unforgiving!",
	aliases: ["evilmode", "enableevil", "disableevil"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (args[0] == "enable" || args[0] == "on") {
			let userData = data.data();
			if (userData.evil == true) return send("You already have evil mode enabled!");
			send("Coin Flipper **Evil Mode** is a mode that will make your experience more grueling, frustrating, and overall evil.\n\nSome things that will change:\n1. You'll never get the max amount of cents when dropshipping\n2. Addons & items that improve flipping won't count\n3. You'll get less cents in your register\n4. Even more evil things\n5. Why would people even enable this\n\nSend `yes` or `no` to confirm your choice");
			msg.channel.awaitMessages(m => m.author.id == msg.author.id, { max: 1, time: 45000 }).then(async collected => {
				if (!collected.first()) {
					send("You didn't answer :/");
					return;
				}
				let message = collected.first();
				message = message.content.toLowerCase();
				if (message == "yes") {
					userData.evil = true;
					userData = await achievementAdd(userData, "ohNo");
					await firestore.doc(`/users/${msg.author.id}`).set(userData);
					send("You enabled **evil mode!**");
				}
				else {
					send("Good job you made the correct choice");
				}
			});
		}
		else if (args[0] == "disable" || args[0] == "off") {
			let userData = data.data();
			if (userData.evil == false) return send("You already have evil mode disabled!");
			userData.evil = false;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			send("You disabled **evil mode!**");
		}
		else { send("Please specify `on/off`"); }
	}
};