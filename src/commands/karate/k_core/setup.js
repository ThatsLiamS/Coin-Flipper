const profanityCheck = require("../../../tools/profanities").profanityCheck;
module.exports = {
	name: "setup",
	aliases: ["start"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd) {
		let userData = data.data();
		if (kd.name != "NA") return send("You already set up your karate coin! View it using `c!karate`!");
		send("What do you want your karate coin's name to be?");
		msg.channel.awaitMessages(m => m.author.id == msg.author.id, { max: 1, time: 30000 }).then(async collected => {
			if (!collected.first()) {
				send("You didn't answer :/");
				return;
			}
			let message = collected.first().cleanContent;
			if (message == "NA") {
				send("You can't name your karate coin `NA` for technical reasons ||also why would you want to||");
				return;
			}
			let hasProfanity = await profanityCheck(message);
			if (hasProfanity == true) {
				send("That name has a nasty word in it! :0");
				return;
			}

			if (message.length > 50) return send("That name is too long!");

			kd.name = message;

			send("What do you want it's type to be? (penny, nickel, dime, quarter, pound, dollar coin)");

			msg.channel.awaitMessages(m => m.author.id == msg.author.id, { max: 1, time: 30000 }).then(async collected => {
				if (!collected.first()) {
					send("You didn't answer :/");
					return;
				}
				message = collected.first().content.toLowerCase();
				let typeList = ["penny", "nickel", "dime", "quarter", "pound", "dollar coin"];
				if (!typeList.includes(message)) return send("That's not a valid type! (penny, nickel, dime, quarter, pound, dollar coin)\nBy the way you have to start the whole process over now rip");

				kd.type = message;
				kd.belt = "white";
				kd.xp = 0;
				kd.level = 1;
				kd.abilities = {
					flip: false,
					spin: false,
					slide: false,
					dive: false,
					swipe: false,
					slice: false
				};

				userData.karate = kd;
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
				send(`You sucessfully set up your katate coin!\n**Name:** ${kd.name}\n**Type:** ${kd.type}\nUse \`c!karate\` to view it!`);
			});
		});
	}
};