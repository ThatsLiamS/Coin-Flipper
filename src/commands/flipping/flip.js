const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const gotItem = require(`${__dirname}/../../tools/gotItem`);
const send = require(`${__dirname}/../../tools/send`);

const normalResponses = [
	"The coin landed on heads",
	"The coin landed on tails"
];
const twentyfourflips = [
	"The coin landed on heads",
	"The coin landed on tails",
	"The coin went to the mine ||pickaxe swinging from side to side||",
	"The coin mined some diamonds",
	"The coin mined some 24 karat gold",
	"The coin tried to mine but fell in some lava",
	"The coin saw some mobs and immediately said 'nah' and walked back out",
	"The coin digged straight down :0",
	"The coin got bored of mining",
	"The coin bought the other 3 medals from the shop (`c!shop`)",
	"The coin found a spawner",
	"The coin found some crystal shards",
	"The coin started to flip but saw diamond ore and stopped to mine it",
	"The coin started to mine some gold but then realized it was a gold coin",
	"The coin was so hard that it used itself to mine",
	"The coin crafted itself into a gold pickaxe",
	"The coin downloaded Minecraft 1.17 and found the warden",
	"The coin only got coal",
	"The coin found 23 karat gold and its mad",
	"The coin suffocated in gravel",
	"The coin found an underground village",
	"The coin mixed water and lava together to make obsidian",
	"The coin drowned somehow",
	"The coin kept mining until it found the world barrier"
];
const extraflips = [
	"The coin landed on heads",
	"The coin landed on tails",
	"The coin got a briefcase and started working",
	"The coin got married",
	"The coin watched TV all night",
	"The coin went to Bot Test JS by using `c!support`",
	"The coin played Among Us",
	"The coin became a pro gamer",
	"The coin went to school and stayed back a grade",
	"The coin rolled under the couch",
	"The coin rusted itself",
	"The coin broke apart and rearranged itself into a statue ||of a coin||",
	"The coin coded a coin bot that got more famous than this one",
	"The coin bought Breath Of The Wild",
	"The coin had a battle royael",
	"The coin used an uno reverse card and flipped you",
	"The coin got a pet and killed it",
	"The coin broke down your door",
	"The coin punched you in the face",
	"The coin made a discord account and created a server that got millions of members",
	"The coin created a famous video game",
	"The coin solved world hunger",
	"The coin kept flipping and flipping",
	"The coin unflipped :0",
	"The coin started a real estate business",
	"The coin posted a dank meme",
	"The coin won the olympics",
	"The coin competed in the world series",
	"The coin went to a gym",
	"The coin ran for president ||and won||",
	"The coin spent itself on Discord Nitro",
	"The coin broke your piggy bank and summoned all its friends to attack you",
	"The coin realized that this is all just a bot and broke the fourth wall",
	"The coin ***emphasized*** its fall",
	"The coin sacrificed its life for you",
	"The coin robbed you",
	"The coin tried to drink some water",
	"The coin learned JS and coded a webpage",
	"The coin got a job on Fiverr",
	"The coin watched some YouTube videos",
	"The coin created a social media account and went viral",
	"The coin bought a new gaming headset B)",
	"The coin watched The Mandalorian",
	"The coin watched Ready Player One",
	"The coin watched a bunch of holiday movies",
	"The coin watched the news",
	"The coin bought a PS5",
	"The coin created its own line of gaming hardware and consoles and put Nintendo, Microsoft, and Sony out of business",
	"The coin got bullied by its older brother dollar",
	"The coin stopped and contemplated life's meaning",
	"The coin said **yeet**",
	"The coin was pog",
	"The coin found the bots token and changed all the code",
	"The coin flew out the window",
	"The coin typed at 5000wpm",
	"The coin bought some new fancy clothes",
	"The coin drew a comic",
	"The coin played its Xbox One X",
	"The coin built a huge skyscraper in Minecraft",
	"The coin became a handyman",
	"The coin took a vacation from flipping",
	"The coin hung out with the dime and quarter",
	"The coin discovered the lost city of Centlantas",
	"The coin won the lottery",
	"The coin fell asleep and dreamed about flipping",
	"The coin rage quitted Cuphead",
	"The coin became a super hero and saved the world",
	"The coin sang christmas carols",
	"The coin flipped a coin ||wait what||",
	"The coin played Among Us and won as impostor",
	"The coin stayed up on new years",
	"The coin climbed mount everest",
	"The coin sneaked onto a spaceship and became the first coin on mars",
	"The coin learned economics and got terrified that the penny would soon be worthless",
	"The coin got 99 friends and became a dollar",
	"The coin said nah and flipped another time",
	"The coin wrote a novel, sold it, and got a big profit",
	"The coin started its own Coin Wikipedia on Fandom",
	"The coin rented a skyscraper",
	"The coin killed a wasp somehow",
	"The coin won a giveaway in a discord server",
	"The coin flipped 6 feet away (social distancing)",
	"The coin speedrunned a corn maze any% and beat the world record",
	"The coin created its own news program",
	"The coin flipped a coin flipped a coin flipped a coin flipped a coin",
	"The coin got its friend Nickel a christmas gift",
	"The coin got stressed from flipping and visited a therapist",
	"The coin flipped itself backwards: sdaeh",
	"The coin made a roblox account but was a noob",
	"The coin was visited by 3 ghosts and learned the true meaning of Christmas",
	"The coin googled how to flip a coin",
	"The coin played rock paper scissors",
	"The coin got food from McDonalds",
	"The coin went to a vacation resort",
	"The coin died and went to heaven",
	"The coin went into the ocean and evaporated - don't try this at home",
	"The coin fell into a piggy bank",
	"The coin baked some treats",
	"The coin learned to be a ninja",
	"The coin played Roblox",
	"The coin used this bot somehow",
	"The coin watched The Office",
	"The coin got addicted to Flappy Bird",
	"The coin used itself as a pinball",
	"The coin fell into lava ||and survived even stronger||",
	"The coin defied gravity and landed at an angle",
	"The coin got all the badges in this bot (use `c!badges`)",
	"The coin looked down and realized it had a fear of heights",
	"The coin built a game with Unity",
	"The coin went into Earth's atmosphere, and titled the axis up so the seasons would never change",
	"The coin disappeared from reality",
	"The coin streamed on Twitch"
];

module.exports = {
	name: "flip",
	description: "Flip a coin, or spice it up with an addon!",
	argument: "Optional: addon name",
	perms: "Embed Links",
	tips: "If flipping is disabled, this won't work. If you're trying to use an addon you don't have, it'll always either land on heads or tails. To view the addons you have, do `c!addons`",
	aliases: ["coinflip"],
	cooldowny: "1 second",
	cooldown: 1000,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		await checkGuild(firebase, message.guild.id);

		let guildata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		let guildData = guildata.data();
		if (guildData.enabled.flipping == undefined || guildData.enabled.flipping == null) guildData.enabled.flipping = true;
		if (guildData.enabled.flipping == false) return;

		async function flip(responses, multiplier = 1, briefcaseChance = 95, type = "normal") {
			let pins = data.data().inv.pingiven;
			if (pins === undefined) pins = 0;
			if (pins > 0) {
				const embed = new Discord.MessageEmbed()
					.setTitle("OWWWWW!!!")
					.setDescription("There was a sharp pin on the coin! Someone must've put it there...\nYou lost 1000 cents!")
					.setColor("RED");

				let cents = userData.currencies.cents;
				cents -= 1000;
				if (cents < 0) cents = 0;

				userData.currencies.cents = cents;
				userData.inv.pingiven = 0;

				firebase.doc(`/users/${message.author.id}`).set(userData);
				send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
				return;
			}

			let output = responses[Math.floor(Math.random() * responses.length)];
			let inputs = ["cents", "register", "multiplier", "donator", "job", "flipped", "minigames"];

			let donator = data.data().donator;
			if (donator == 0) donator = "none";
			else if (donator == 1) donator = "gold tier";
			else donator = "platinum tier";

			let replaces = [data.data().currencies.cents, data.data().currencies.register, data.data().currencies.multiplier, donator, data.data().job, data.data().stats.flipped, data.data().stats.minigames_won];
			let u = 0;
			while (u < 8) {
				let input = inputs[u];
				while (output.includes(`{${input}}`)) {
					output = output.replace(`{${input}}`, replaces[u]);
				}
				u++;
			}

			while (output.includes("{{")) {
				let fIndex = output.indexOf("{{");
				let lIndex = output.indexOf("}}");
				let found = output.slice(fIndex + 2, lIndex);
				let inPlace = null;
				let layers = found.split(".");
				for (let layer of layers) {
					if (inPlace === null) inPlace = userData[layer];
					else inPlace = inPlace[layer];
					if (inPlace === undefined) {
						inPlace = "not found";
						break;
					}
				}
				output = output.replace(`{{${found}}}`, inPlace);
			}
			let gotBriefcase = "";

			if (data.data().evil == true) briefcaseChance = 99;
			if (data.data().donator == 1) briefcaseChance -= 5;
			if (data.data().donator == 2) briefcaseChance -= 10;

			let randomBri = Math.random() * 100;
			if (randomBri > briefcaseChance) {

				let briefcases = data.data().inv.briefcase;
				briefcases = Number(briefcases) + Number(1);
				gotBriefcase = " You also got a 💼 Briefcase!";

				userData.inv.briefcase = briefcases;
				userData = await gotItem(userData);
			}

			let randomAmt = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
			if (data.data().evil != true) randomAmt = Math.ceil(randomAmt * multiplier);

			let multi = userData.currencies.multiplier;
			if (!multi) multi = 1;
			if (userData.evil == true) multi = 1;

			if (multi == 1 && (userData.donator > 0 && userData.donator !== undefined)) {
				multi += 1.5;
				userData.currencies.multiplier = multi;
			}
			randomAmt = Math.ceil(randomAmt * multi);

			let flips = userData.stats.flipped;
			flips = Number(flips) + Number(1);
			userData.stats.flipped = flips;

			if (flips >= 1000) userData = await achievementAdd(userData, "ultimateFlipper");
			if (type == "normal") {

				if (data.data().inv.platinumdisk > 0 && data.data().evil != true) randomAmt = Math.ceil(randomAmt * 3);
				else if (data.data().inv.golddisk > 0 && data.data().evil != true) randomAmt = Math.ceil(randomAmt * 2);

				let bal = data.data().currencies.cents;
				bal = bal + randomAmt;
				userData.currencies.cents = bal;
				let percent = 0.1;

				if (data.data().donator == 1) percent = 0.15;
				if (data.data().donator == 2) percent = 0.25;
				if (data.data().evil == true) percent = 0.075;

				if (data.data().inv.label > 0 && (data.data().evil === false || data.data().evil === undefined)) {

					if (data.data().donator == 1) percent = 0.25;
					else if (data.data().donator == 2) percent = 0.35;
					else percent = 0.2;
				}
				let reg = data.data().currencies.register;
				let registerAmt = Math.ceil(randomAmt * percent);
				reg = reg + registerAmt;
				userData.currencies.register = reg;

				const embed = new Discord.MessageEmbed()
					.setTitle(output)
					.setDescription(`You got ${randomAmt} cents!${gotBriefcase}`)
					.setColor('ORANGE');

				send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
			}
			else{

				randomAmt = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
				let bal = data.data().karate.xp;
				bal = bal + randomAmt;
				userData.karate.xp = bal;
				let level = data.data().karate.level;
				let levelUp = level * 20;

				if (bal > levelUp) {
					level = Number(level) + Number(1);
					bal = bal - levelUp;

					if (bal < 0) bal = 0;
					if (level == 2) userData.karate.belt = "red";
					if (level == 4) userData.karate.belt = "yellow";
					if (level == 6) userData.karate.belt = "orange";
					if (level == 9) userData.karate.belt = "green";
					if (level == 12) userData.karate.belt = "blue";
					if (level == 15) userData.karate.belt = "purple";
					if (level == 16) userData = await achievementAdd(userData, "blackBelt");
					if (level == 21) userData.karate.belt = "brown";
					if (level == 27) {

						userData.karate.belt = "black";
						let uniforms = userData.inv.masteruniform;
						if (uniforms === undefined) uniforms = 0;
						uniforms++;

						userData.inv.masteruniform = uniforms;
						userData = await achievementAdd(userData, "theMaster");
						userData = await gotItem(userData);
					}
					userData.karate.level = level;
					userData.karate.xp = bal;
					gotBriefcase = ` You also leveled up to **level ${level}**!`;
				}
				const embed = new Discord.MessageEmbed()
					.setTitle(output)
					.setDescription(`You got ${randomAmt} XP!${gotBriefcase}`)
					.setColor('RED');

				send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
			}
			await firebase.doc(`/users/${message.author.id}`).set(userData);
		}


		if (args[0] == "extra") { flip(extraflips); }
		else if (args[0] == "opposite") { flip(["The coin landed on heads - which means tails", "The coin landed on tails - which means heads"]); }
		else if (args[0] == "penny" && userData.inv.bronzecoin > 0) { flip(["The penny landed on heads", "The penny landed on tails", "The penny realized it was worthless", "The penny shined itself", "The penny hibernated and woke up rusty", "The penny was sad that it was only 1 cent", "The penny wrapped some string around it and became a bronze medal", "The penny fell into a piggy bank"]); }
		else if (args[0] == "dime" && userData.inv.silvercoin > 0) { flip(["The dime landed on heads", "The dime landed on tails", "The dime flexed on the penny for being 10x more useful", "The dime got 9 friends and became a dollar", "The dime realized it was the smallest coin to exist", "The dime slid across the floor", "The dime learned karate", "The dime became the CEO of a huge dime-making company", "The dime read memes for the rest of its life", `The dime sold some smoothies`]); }
		else if (args[0] == "dollar" && userData.inv.goldcoin > 0) { flip(["The dollar landed on heads", "The dollar landed on tails", "The dollar slowly floated down", "The dollar started to flip but then remembered that it wasn't a coin and stopped", "The dollar flew out the window - you didn't care until you remembered that it was an $100 bill", "The dollar wondered why you are a flipping a dollar after buying a gold coin", "The dollar wooshed into your piggy bank", "The dollar smacked you in the face and gave you several paper cuts", "The dollar wanted to go back to its family ;-;", "The dollar spent itself on a candy"], 1.5); }
		else if (args[0] == "24" && userData.inv.kcoin > 0) { flip(twentyfourflips, 1, 90); }
		else if (args[0] == "train" && userData.karate.abilities.flip == true) { flip(["The coin punched", "The coin kicked", "The coin did a shrunken", "The coin attacked so fast that time slowed down for them", "The coin won a battle"], 1, 150, "karate"); }
		else if (args[0]) {

			if (userData.addons.customaddons.first.name.toLowerCase() == args[0] && args[0] != "none") {

				let responses = userData.addons.customaddons.first.responses;
				if (responses[args[1] - 1]) responses = [responses[args[1] - 1]];
				flip(responses);
			}
			else if (userData.addons.customaddons.second.name.toLowerCase() == args[0] && args[0] != "none") {

				let responses = userData.addons.customaddons.second.responses;
				if (responses[args[1] - 1]) responses = [responses[args[1] - 1]];
				flip(responses);
			}
			else if (userData.addons.customaddons.third.name.toLowerCase() == args[0] && args[0] != "none") {

				let responses = userData.addons.customaddons.third.responses;
				if (responses[args[1] - 1]) responses = [responses[args[1] - 1]];
				flip(responses);
			}
			else {

				let array = await checkOnline(firebase, message.author.id, userData);
				userData = array[1];
				let online = array[0];
				if (online == false) return flip(normalResponses);
				let od = userData.online.addonInv;
				if (od.first.name.toLowerCase() == args[0] && args[0] != "none") {

					let responses = od.first.responses;
					if (responses) flip(responses);
					else flip(normalResponses);
				}
				else if (od.second.name.toLowerCase() == args[0] && args[0] != "none") {

					let responses = od.second.responses;
					if (responses) flip(responses);
					else flip(normalResponses);
				}
				else if (od.third.name.toLowerCase() == args[0] && args[0] != "none") {

					let responses = od.third.responses;
					if (responses) flip(responses);
					else flip(normalResponses);
				}
				else {
					if(guildData.serveraddons) {

						let sPath = false;
						let sad = guildData.serveraddons;
						if (sad.first.name.toLowerCase() == args[0] && args[0] != "none") {
							sPath = "first";
						}
						if (sad.second.name.toLowerCase() == args[0] && args[0] != "none") {
							sPath = "second";
						}
						if (sad.third.name.toLowerCase() == args[0] && args[0] != "none") {
							sPath = "third";
						}
						if (sPath) {
							let responses = sad[sPath].responses;
							if (responses) flip(responses);
							else flip(normalResponses);
						}
						else { flip(normalResponses);}
					}
					else {
						flip(normalResponses);
					}
					return;
				}
			}
		}
		else { flip(normalResponses); }
	}
};