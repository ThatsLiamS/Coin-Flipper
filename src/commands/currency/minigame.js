const check = require("../../tools/check");
const checkGuild = require("../../tools/checkGuild");
const minigameWords = require("../../tools/constants").minigameWords;
const achievementAdd = require("../../tools/achievementAdd");
const disbut = require("discord-buttons");
module.exports = {
    name: "minigame",
    description: "Start a minigame in your server - it can be repeat, unscramble, timing, or choose!",
    argument: "None",
    perms: "Embed Links",
    tips: "If minigames are disabled, this command won't work. Also, if publiccreate is disabled, you'll need the Manage Server permission to start a minigame",
    aliases: ["minigames"],
    execute: async function(firestore, args, command, msg, discord, data, send, bot) {
      await checkGuild(firestore, msg.guild.id);
      let guildata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
      if (guildata.data().enabled.minigames == false) return;
      if (guildata.data().enabled.publiccreate == false && !msg.member.hasPermission('MANAGE_GUILD')) return send("Sorry, in this server only people with the **Manage Server** permission can use that command!");
      let guildData = guildata.data();
      if (guildData.minigames.in_game == true || guildData.minigames.starting == true) return send("A minigame is already in progress!");
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
      let types = ["repeat", "unscramble", "send", "buttons"];
      let random = Math.random() * 10;
      if (random < 2.5) type = "repeat";
      else if (random < 5) type = "unscramble";
			else if (random < 7.5) type = "buttons";
      else type = "send";

      let embed = new discord.MessageEmbed()
      .setTitle("A minigame has been started!")
      .setDescription("<@" + msg.author.id + "> started a minigame! Get ready!")
      .setColor('RED');
      send(embed);

      await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);

      setTimeout(async () => {

        if (type == "repeat") {
          let output1 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
          let output2 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
          let output3 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
          let output4 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
          guildData.minigames.looking_for = `${output1} ${output2} ${output3} ${output4}`;
          guildData.minigames.cheater = `${output1}⠀${output2}⠀${output3}⠀${output4}`;
          guildData.minigames.in_game = true;
          await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
          send(`**Repeat after me!**\n\n\`${output1}⠀${output2}⠀${output3}⠀${output4}\``);

          msg.channel.awaitMessages(m => (m.content.toLowerCase() == guildData.minigames.looking_for || m.content.toLowerCase() == guildData.minigames.cheater) && m.author.bot === false, {max: 1, time: 15000}).then(async collected => {
            if (!collected.first()) {
              send("No one typed it in time!");
              guildData.minigames.in_game = false;
              guildData.minigames.starting = false;
              await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
              return;
            }
            let firstMsg = collected.first();
            await check(firestore, firstMsg.author.id);
            let userdata = await firestore.doc(`/users/${firstMsg.author.id}`).get();     
            let userData = userdata.data();
						if (firstMsg.content.toLowerCase() == guildData.minigames.cheater) {
							firstMsg.author.send("Don't copy paste smh").catch(err => {
								send(`${firstMsg.author} Don't copy paste smh`);
							});
							let localData = await achievementAdd(userData, "dontCheat", true);
							if (localData) {
								userData = localData;
								await firestore.doc(`/users/${msg.author.id}`).set(userData);
							}
							guildData.minigames.in_game = false;
              guildData.minigames.starting = false;
              await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
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
            await firestore.doc(`/users/${firstMsg.author.id}`).set(userData);
            await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
            send(`<@${firstMsg.author.id}> answered first and got ${centAmt} cents!`);
          });
        } else if (type == "unscramble") {
          let randomWord = "";
          let shuffledWord = "";
          async function getWord() {
            let word = minigameWords[Math.floor(Math.random() * minigameWords.length)];
            let shuffled = await word.split('').sort(function(){return 0.5-Math.random()}).join('');
            if (word == shuffled) getWord();
            else {
              randomWord = word;
              shuffledWord = shuffled;
            }
          }
          await getWord();
          guildData.minigames.looking_for = randomWord;
          guildData.minigames.in_game = true;
          send(`**Unscramble this word or phrase!**\n\n${shuffledWord}`);
          await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
          msg.channel.awaitMessages(m => m.content.toLowerCase() == guildData.minigames.looking_for && m.author.bot === false, {max: 1, time: 15000}).then(async collected => {
            if (!collected.first()) {
              send(`No one answered it in time! The word was \`${guildData.minigames.looking_for}\``);
              guildData.minigames.in_game = false;
              guildData.minigames.starting = false;
              await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
              return;
            }
            let firstMsg = collected.first();
            await check(firestore, firstMsg.author.id);
            let userdata = await firestore.doc(`/users/${firstMsg.author.id}`).get();
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
            await firestore.doc(`/users/${firstMsg.author.id}`).set(userData);
            await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
            send(`<@${firstMsg.author.id}> answered first and got ${centAmt} cents!`);
          });
        } else if (type == "send") {
          let word = minigameWords[Math.floor(Math.random() * minigameWords.length)];
          guildData.minigames.looking_for = "";
          guildData.minigames.in_game = true;
          await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
          if (!msg.guild.me.hasPermission("SEND_MESSAGES") || !msg.guild.me.hasPermission("EMBED_LINKS")) return;
          msg.channel.send(`**When I say GO, send the word or phrase!**\n\n\`${word}\`\n\nNot time yet!`).then(async sentmessage => {
            await setTimeout(async function(){
              sentmessage.edit(`**When I say GO, send the word or phrase!**\n\n\`${word}\`\n\n**GO!**`);
              data = await firestore.doc(`/guilds/${msg.guild.id}`).get();
              guildData = data.data();
              guildData.minigames.looking_for = word;
              await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
            }, 3000);
            msg.channel.awaitMessages(m => m.content.toLowerCase() == guildData.minigames.looking_for && m.author.bot === false, {max: 1, time: 15000}).then(async collected => {
              if (!collected.first()) {
                send("No one typed it in time!");
                guildData.minigames.in_game = false;
                guildData.minigames.starting = false;
                await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
                return;
              }
              let firstMsg = collected.first();
              await check(firestore, firstMsg.author.id);
              let userdata = await firestore.doc(`/users/${firstMsg.author.id}`).get();     
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
              await firestore.doc(`/users/${firstMsg.author.id}`).set(userData);
              await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
              send(`<@${firstMsg.author.id}> answered first and got \`${centAmt}\` cents!`);
            });
          });
        } else {
					guildData.minigames.looking_for = "";
          guildData.minigames.in_game = true;
					let message = await msg.channel.send("When I say go, click the button that matches the word!\n\n`???`\n\nNot time yet!");
					setTimeout(async () => {
						let word1 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
						let word2 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
						let word3 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
						let word4 = minigameWords[Math.floor(Math.random() * minigameWords.length)];
						let wordList = [word1, word2, word3, word4];
						let wordFirst = wordList[Math.floor(Math.random() * wordList.length)];
						wordList.splice(wordList.indexOf(wordFirst), 1);
						let wordSecond = wordList[Math.floor(Math.random() * 		wordList.length)];
						wordList.splice(wordList.indexOf(wordSecond), 1);
						let wordThird = wordList[Math.floor(Math.random() * wordList.length)];
						wordList.splice(wordList.indexOf(wordThird), 1);
						let wordFourth = wordList[Math.floor(Math.random() * wordList.length)];
						wordList.splice(wordList.indexOf(wordFourth), 1);
						let newWordList = [wordFirst, wordSecond, wordThird, wordFourth];
						let wordChosen = newWordList[Math.floor(Math.random() * newWordList.length)];
						let button1 = new disbut.MessageButton()
						.setStyle("blurple")
						.setLabel(wordFirst)
						.setID(`button_${wordFirst}`);
						let button2 = new disbut.MessageButton()
						.setStyle("blurple")
						.setLabel(wordSecond)
						.setID(`button_${wordSecond}`);
						let button3 = new disbut.MessageButton()
						.setStyle("blurple")
						.setLabel(wordThird)
						.setID(`button_${wordThird}`);
						let button4 = new disbut.MessageButton()
						.setStyle("blurple")
						.setLabel(wordFourth)
						.setID(`button_${wordFourth}`);
						await message.edit(`When I say go, click the button that matches the word!\n\n\`${wordChosen}\`\n\n**GO!**`, {
							buttons: [button1, button2, button3, button4]
						});
						await message.awaitButtons(button => button.id == `button_${wordChosen}`, { time: 15000, max: 1 }).then(async collected => {
							let button = collected.first();
							if (!button) {
								send("No one clicked it in time!");
								guildData.minigames.in_game = false;
                guildData.minigames.starting = false;
                await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
								return;
							}
							await check(firestore, button.clicker.user.id);
							let userdata = await firestore.doc(`/users/${button.clicker.user.id}`).get();     
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
              await firestore.doc(`/users/${button.clicker.user.id}`).set(userData);
              await firestore.doc(`/guilds/${msg.guild.id}`).set(guildData);
							button.reply.send("You won!", true);
							await button1.setDisabled();
							await button2.setDisabled();
							await button3.setDisabled();
							await button4.setDisabled();
							send(`<@${button.clicker.user.id}> answered first and got 10 cents!`);
						});
					}, 3000);
				}
      }, 5000);
    }
}