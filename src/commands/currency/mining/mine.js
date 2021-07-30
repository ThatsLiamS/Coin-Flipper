const Discord = require('discord.js');

const checkMining = require(`${__dirname}/../../../tools/checkMining`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "mine",
	description: "Mine and get some stone or gems!",
	argument: "None",
	perms: "Embed Links",
	tips: "You can only use this if you have a pickaxe!",
	cooldowny: "1 minute (45 seconds for gold tier, 30 seconds for platinum tier)",
	cooldown: 60,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.inv.pickaxe < 1 || userData.inv.pickaxe === undefined) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a pickaxe to use this!" });
		userData = await checkMining(firebase, message.author, userData);
		let miningData = userData.mining;
		let pickaxes = {
			standard: {
				centsMin: 10,
				centsMax: 40,
				rockMin: 5,
				rockMax: 10,
				sapphire: 95,
				ruby: 99,
				opal: 100,
				diamond: 100,
				maxSapphire: 1,
				maxRuby: 1,
				maxDiamond: 1
			},
			stone: {
				centsMin: 15,
				centsMax: 50,
				rockMin: 10,
				rockMax: 15,
				sapphire: 75,
				ruby: 95,
				opal: 99,
				diamond: 100,
				maxSapphire: 2,
				maxRuby: 1,
				maxOpal: 1,
				maxDiamond: 1
			},
			shiny: {
				centsMin: 25,
				centsMax: 60,
				rockMin: 15,
				rockMax: 25,
				sapphire: 65,
				ruby: 75,
				opal: 90,
				diamond: 99,
				maxSapphire: 3,
				maxRuby: 2,
				maxOpal: 1,
				maxDiamond: 1
			},
			lava: {
				centsMin: 35,
				centsMax: 75,
				rockMin: 20,
				rockMax: 40,
				sapphire: 55,
				ruby: 65,
				opal: 75,
				diamond: 95,
				maxSapphire: 4,
				maxRuby: 3,
				maxOpal: 2,
				maxDiamond: 1
			},
			destructive: {
				centsMin: 45,
				centsMax: 85,
				rockMin: 30,
				rockMax: 50,
				sapphire: 45,
				ruby: 55,
				opal: 65,
				diamond: 85,
				maxSapphire: 5,
				maxRuby: 4,
				maxOpal: 2,
				maxDiamond: 1
			},
			diamond: {
				centsMin: 60,
				centsMax: 95,
				rockMin: 50,
				rockMax: 80,
				sapphire: 35,
				ruby: 45,
				opal: 55,
				diamond: 75,
				banana: 90,
				maxSapphire: 8,
				maxRuby: 5,
				maxOpal: 3,
				maxDiamond: 2,
				maxBanana: 1
			},
			banana: {
				centsMin: 75,
				centsMax: 110,
				rockMin: 65,
				rockMax: 95,
				sapphire: 25,
				ruby: 35,
				opal: 45,
				diamond: 60,
				banana: 75,
				steel: 90,
				maxSapphire: 12,
				maxRuby: 8,
				maxOpal: 6,
				maxDiamond: 4,
				maxBanana: 1,
				maxSteel: 1
			},
			steel: {
				centsMin: 90,
				centsMax: 125,
				rockMin: 80,
				rockMax: 110,
				sapphire: 15,
				ruby: 25,
				opal: 35,
				diamond: 50,
				banana: 65,
				steel: 80,
				infinitystone: 95,
				maxSapphire: 15,
				maxRuby: 11,
				maxOpal: 9,
				maxDiamond: 6,
				maxBanana: 2,
				maxSteel: 1,
				maxInfinity: 1
			},
			infinity: {
				centsMin: 100,
				centsMax: 140,
				rockMin: 90,
				rockMax: 125,
				sapphire: 8,
				ruby: 15,
				opal: 25,
				diamond: 40,
				banana: 55,
				steel: 70,
				infinitystone: 85,
				maxSapphire: 19,
				maxRuby: 15,
				maxOpal: 13,
				maxDiamond: 10,
				maxBanana: 3,
				maxSteel: 2,
				maxInfinity: 1
			}
		};

		let randomNumber = Math.random() * 100;
		let myPick = pickaxes[miningData.pickaxe];
		let centsFound = Math.floor(Math.random() * (myPick.centsMax - myPick.centsMin + 1)) + myPick.centsMin;
		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(centsFound);
		userData.currencies.cents = bal;
		if (userData.inv.hammer > 0) {
			myPick.rockMin += 10;
			myPick.rockMax += 10;
			myPick.sapphire -= 5;
			myPick.ruby -= 5;
			myPick.opal -= 5;
			myPick.diamond -= 5;
			if (myPick.banana) myPick.banana -= 5;
			if (myPick.steel) myPick.steel -= 5;
			if (myPick.infinitystone) myPick.infinityStone -= 5;
		}

		if (miningData.easier) {
			myPick.rockMin += miningData.easier * 2;
			myPick.rockMax += miningData.easier * 2;
			myPick.sapphire -= miningData.easier;
			myPick.ruby -= miningData.easier;
			myPick.opal -= miningData.easier;
			myPick.diamond -= miningData.easier;
			if (myPick.banana) myPick.banana -= miningData.easier;
			if (myPick.steel) myPick.steel -= miningData.easier;
			if (myPick.infinitystone) myPick.infinityStone -= miningData.easier;
		}
		let rockFound = Math.floor(Math.random() * (myPick.rockMax - myPick.rockMin + 1)) + myPick.rockMin;
		miningData.rock = miningData.rock + rockFound;
		let foundList = [];
		foundList.push(`${centsFound} cents`);
		foundList.push(`${rockFound} rock`);

		if (randomNumber > myPick.sapphire) {
			let sapphiresFound = Math.floor(Math.random() * (myPick.maxSapphire - 1 + 1)) + 1;
			miningData.sapphire = miningData.sapphire + sapphiresFound;
			foundList.push(`${sapphiresFound} sapphires`);
		}
		if (randomNumber > myPick.ruby) {
			let sapphiresFound = Math.floor(Math.random() * (myPick.maxRuby - 1 + 1)) + 1;
			miningData.ruby = miningData.ruby + sapphiresFound;
			foundList.push(`${sapphiresFound} rubies`);
		}
		if (randomNumber > myPick.opal) {
			let sapphiresFound = Math.floor(Math.random() * (myPick.maxOpal - 1 + 1)) + 1;
			miningData.opal = miningData.opal + sapphiresFound;
			foundList.push(`${sapphiresFound} opals`);
		}
		if (randomNumber > myPick.diamond) {
			let sapphiresFound = Math.floor(Math.random() * (myPick.maxDiamond - 1 + 1)) + 1;
			miningData.diamond = miningData.diamond + sapphiresFound;
			foundList.push(`${sapphiresFound} diamonds`);
		}
		if (myPick.banana) {
			if (randomNumber > myPick.banana) {
				let sapphiresFound = Math.floor(Math.random() * (myPick.maxBanana - 1 + 1)) + 1;
				miningData.banana = miningData.banana + sapphiresFound;
				foundList.push(`${sapphiresFound} bananas`);
			}
		}
		if (myPick.steel) {
			if (randomNumber > myPick.steel) {
				let sapphiresFound = Math.floor(Math.random() * (myPick.maxSteel - 1 + 1)) + 1;
				if (miningData.steel === undefined) miningData.steel = 0;
				miningData.steel = miningData.steel + sapphiresFound;
				foundList.push(`${sapphiresFound} steel`);
			}
		}
		if (myPick.infinitystone) {
			if (randomNumber > myPick.infinitystone) {
				let sapphiresFound = Math.floor(Math.random() * (myPick.maxInfinity - 1 + 1)) + 1;
				if (miningData.infinitystone === undefined) miningData.infinitystone = 0;
				miningData.infinitystone = miningData.infinitystone + sapphiresFound;
				foundList.push(`${sapphiresFound} infinity stones`);
			}
		}
		const embed = new Discord.MessageEmbed()
			.setTitle(`Mining time! ⛏️`)
			.setDescription("Good loot woo\n[Mine more crystals](https://top.gg/bot/791660709246271509)")
			.addField("You got:", foundList.join('\n').toString())
			.setColor("#cccccc");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

		userData.mining = miningData;
		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};