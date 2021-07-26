const Discord = require('discord.js');

const check = require(`${__dirname}/../../tools/check`);
const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const minigameWords = require(`${__dirname}/../../tools/constants`).minigameWords;
const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "minigame",
	description: "Start a minigame in your server - it can be repeat, unscramble, timing, or choose!",
	argument: "None",
	perms: "Embed Links",
	tips: "If minigames are disabled, this command won't work. Also, if publiccreate is disabled, you'll need the Manage Server permission to start a minigame",
	aliases: ["minigames"],
	execute: async function(msg, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, msg.guild.id);
		let guildata = await firebase.doc(`/guilds/${msg.guild.id}`).get();
		if (guildata.data().enabled.minigames == false) return;
		if (guildata.data().enabled.publiccreate == false && !msg.member.hasPermission('MANAGE_GUILD')) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "Sorry, in this server only people with the **Manage Server** permission can use that command!" });
		let guildData = guildata.data();
		if (guildData.minigames.in_game == true || guildData.minigames.starting == true) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "A minigame is already in progress!" });
		guildData.minigames.starting = true;
		guildData.minigames.host = msg.author.id;

		let alphabet = [
			"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
			"p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3",
			"4", "5", "6", "7", "8", "9"
		];

		let id1 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id2 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id3 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id4 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id5 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id6 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let fullId = `${id1}${id2}${id3}${id4}${id5}${id6}`;

		guildData.minigames.minigame_id = fullId;
		let type = ["repeat", "unscramble", "send", "buttons"];
		let random = Math.random() * 10;

		if (random < 3.3) type = "repeat";
		else if (random < 6.6) type = "unscramble";
		else type = "send";

		const embed = new Discord.MessageEmbed()
			.setTitle("A minigame has been started!")
			.setDescription(`${msg.author} started a minigame! Get ready!`)
			.setColor('RED');
		send.sendChannel({ channel: msg.channel, author: msg.author }, { embeds: [embed] });

		await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);

		setTimeout(async () => {

			if (type == "repeat") {
				let output1 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
				let output2 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
				let output3 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
				let output4 = minigameWords[Math.floor(Math.random() * minigameWords.length)];

				guildData.minigames.looking_for = `${output1} ${output2} ${output3} ${output4}`;
				guildData.minigames.cheater = `${output1}⠀${output2}⠀${output3}⠀${output4}`;
				guildData.minigames.in_game = true;

				await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
				send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `**Repeat after me!**\n\n\`${output1}⠀${output2}⠀${output3}⠀${output4}\`` });

				msg.channel.awaitMessages(m => (m.content.toLowerCase() == guildData.minigames.looking_for || m.content.toLowerCase() == guildData.minigames.cheater) && m.author.bot === false, { max: 1, time: 15000 }).then(async collected => {
					if (!collected.first()) {
						send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "No one typed it in time!" });
						guildData.minigames.in_game = false;
						guildData.minigames.starting = false;

						await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
						return;
					}

					let firstMsg = collected.first();
					await check(firebase, firstMsg.author.id);
					let userdata = await firebase.doc(`/users/${firstMsg.author.id}`).get();
					let userData = userdata.data();

					if (firstMsg.content.toLowerCase() == guildData.minigames.cheater) {
						send.sendUser(firstMsg.author, { content: "Don't copy paste smh" });

						let localData = await achievementAdd(userData, "dontCheat", true);
						if (localData) {
							userData = localData;
							await firebase.doc(`/users/${msg.author.id}`).set(userData);
						}
						guildData.minigames.in_game = false;
						guildData.minigames.starting = false;
						await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
						return;
					}
					let centAmt = 10;
					if (userData.inv.controller > 0) centAmt = 50;

					let bal = userData.currencies.cents;
					bal = Number(bal) + Number(centAmt);
					userData.currencies.cents = bal;

					let wins = userData.stats.minigames_won;
					wins = Number(wins) + Number(1);

					userData.stats.minigames_won = wins;
					guildData.minigames.in_game = false;
					guildData.minigames.starting = false;

					await firebase.doc(`/users/${firstMsg.author.id}`).set(userData);
					await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
					send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `${firstMsg.author} answered first and got ${centAmt} cents!` });

				});
			}
			else if (type == "unscramble") {
				let randomWord = "";
				let shuffledWord = "";

				/* WHY IS THIS HERE?? */
				async function getWord() {
					let word = minigameWords[Math.floor(Math.random() * minigameWords.length)];
					let shuffled = await word.split('').sort(function() { return 0.5 - Math.random(); }).join('');
					if (word == shuffled) {
						getWord();
					}
					else {
						randomWord = word;
						shuffledWord = shuffled;
					}
				}

				await getWord();
				guildData.minigames.looking_for = randomWord;
				guildData.minigames.in_game = true;

				send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `**Unscramble this word or phrase!**\n\n${shuffledWord}` });
				await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);

				msg.channel.awaitMessages(m => m.content.toLowerCase() == guildData.minigames.looking_for && m.author.bot === false, { max: 1, time: 15000 }).then(async collected => {
					if (!collected.first()) {
						send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `No one answered it in time! The word was \`${guildData.minigames.looking_for}\`` });
						guildData.minigames.in_game = false;
						guildData.minigames.starting = false;

						await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
						return;
					}

					let firstMsg = collected.first();
					await check(firebase, firstMsg.author.id);
					let userdata = await firebase.doc(`/users/${firstMsg.author.id}`).get();
					let userData = userdata.data();
					let centAmt = 10;

					if (userData.inv.controller > 0) centAmt = 50;

					let bal = userData.currencies.cents;
					bal = Number(bal) + Number(centAmt);
					userData.currencies.cents = bal;

					let wins = userData.stats.minigames_won;
					wins = Number(wins) + Number(1);
					userData.stats.minigames_won = wins;

					guildData.minigames.in_game = false;
					guildData.minigames.starting = false;

					await firebase.doc(`/users/${firstMsg.author.id}`).set(userData);
					await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
					send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `${firstMsg.author} answered first and got ${centAmt} cents!` });

				});
			}
			else if (type == "send") {

				let word = minigameWords[Math.floor(Math.random() * minigameWords.length)];
				guildData.minigames.looking_for = "";
				guildData.minigames.in_game = true;

				await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
				if (!msg.guild.me.hasPermission("SEND_MESSAGES") || !msg.guild.me.hasPermission("EMBED_LINKS")) return;

				msg.channel.send(`**When I say GO, send the word or phrase!**\n\n\`${word}\`\n\nNot time yet!`).then(async sentmessage => {

					await setTimeout(async function() {
						sentmessage.edit(`**When I say GO, send the word or phrase!**\n\n\`${word}\`\n\n**GO!**`);
						data = await firebase.doc(`/guilds/${msg.guild.id}`).get();
						guildData = data.data();
						guildData.minigames.looking_for = word;
						await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
					}, 3000);

					msg.channel.awaitMessages(m => m.content.toLowerCase() == guildData.minigames.looking_for && m.author.bot === false, { max: 1, time: 15000 }).then(async collected => {
						if (!collected.first()) {
							send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "No one typed it in time!" });

							guildData.minigames.in_game = false;
							guildData.minigames.starting = false;
							await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
							return;
						}

						let firstMsg = collected.first();
						await check(firebase, firstMsg.author.id);
						let userdata = await firebase.doc(`/users/${firstMsg.author.id}`).get();
						let userData = userdata.data();
						let centAmt = 10;
						if (userData.inv.controller > 0) centAmt = 50;

						let bal = userData.currencies.cents;
						bal = Number(bal) + Number(centAmt);
						userData.currencies.cents = bal;

						let wins = userData.stats.minigames_won;
						wins = Number(wins) + Number(1);

						userData.stats.minigames_won = wins;
						guildData.minigames.in_game = false;
						guildData.minigames.starting = false;

						await firebase.doc(`/users/${firstMsg.author.id}`).set(userData);
						await firebase.doc(`/guilds/${msg.guild.id}`).set(guildData);
						send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `${firstMsg.author} answered first and got \`${centAmt}\` cents!` });

					});
				});
			}
		}, 5000);
	}
};