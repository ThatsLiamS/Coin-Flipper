const profanityCheck = require(`${__dirname}/../../../tools/profanities`).profanityCheck;
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "setup",
	aliases: ["start"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		if (kd.name != "NA") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already set up your karate coin! View it using `c!karate`!" });

		send.sendChannel({ channel: message.channel, author: message.author }, { content: "What do you want your karate coin's name to be?" });

		message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000 }).then(async collected1 => {
			if (!collected1.first()) {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't answer :/" });
				return;
			}
			let msg = collected1.first().cleanContent;
			if (msg == "NA") {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't name your karate coin `NA` for technical reasons ||also why would you want to||" });
				return;
			}
			let hasProfanity = await profanityCheck(message);
			if (hasProfanity == true) {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "That name has a nasty word in it! :0" });
				return;
			}

			if (msg.length > 50) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That name is too long!" });

			kd.name = msg;

			send.sendChannel({ channel: message.channel, author: message.author }, { content: "What do you want it's type to be? (penny, nickel, dime, quarter, pound, dollar coin)" });

			message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000 }).then(async collected2 => {
				if (!collected2.first()) {
					send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't answer :/" });
					return;
				}

				msg = collected2.first().content.toLowerCase();
				let typeList = ["penny", "nickel", "dime", "quarter", "pound", "dollar coin"];
				if (!typeList.includes(msg)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid type! (penny, nickel, dime, quarter, pound, dollar coin)\nBy the way you have to start the whole process over now rip" });

				kd.type = msg;
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
				await firebase.doc(`/users/${message.author.id}`).set(userData);

				send.sendChannel({ channel: message.channel, author: message.author }, { content: `You sucessfully set up your katate coin!\n**Name:** ${kd.name}\n**Type:** ${kd.type}\nUse \`c!karate\` to view it!` });

			});
		});
	}
};