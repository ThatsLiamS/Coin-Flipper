const checkMining = require(`${__dirname}/../../../tools/checkMining`);
const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "upgrade",
	description: "Upgrade your pickaxe!",
	argument: "None",
	perms: "",
	aliases: ["upgradepick", "upgradepickaxe", "increase", "levelup"],
	tips: "You can only use this if you have a pickaxe, and you can only upgrade to the next pickaxe that you have access to",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.inv.pickaxe < 1 || userData.inv.pickaxe === undefined) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a pickaxe to use this!" });
		userData = await checkMining(firebase, message.author, userData);

		let miningData = userData.mining;
		let pickaxeCosts = {
			stone: {
				rock: 50,
				emote: "<:stone_pickaxe:839207778672443412>",
			},
			shiny: {
				rock: 100,
				sapphire: 5,
				emote: "<:shiny_pickaxe:839207778660778004>"
			},
			lava: {
				rock: 300,
				sapphire: 10,
				ruby: 5,
				emote: "<:lava_pickaxe:839208806566592532>"
			},
			destructive: {
				rock: 550,
				sapphire: 20,
				ruby: 15,
				opal: 10,
				emote: "<:destructive_pickaxe:839207778585280553>"
			},
			diamond: {
				rock: 800,
				sapphire: 30,
				ruby: 25,
				opal: 15,
				diamond: 10,
				emote: "<:diamond_pickaxe:839207779092267018>"
			},
			banana: {
				rock: 1000,
				sapphire: 50,
				ruby: 35,
				opal: 25,
				diamond: 15,
				banana: 5,
				emote: "<:banana_pickaxe:839207778479505408>"
			},
			steel: {
				rock: 5000,
				sapphire: 100,
				ruby: 50,
				opal: 25,
				diamond: 20,
				banana: 10,
				steel: 5,
				emote: "<:steel_pickaxe:844307964093136907>"
			},
			infinity: {
				rock: 10000,
				sapphire: 200,
				ruby: 75,
				opal: 50,
				diamond: 30,
				banana: 20,
				steel: 10,
				infinitystone: 10,
				emote: "<:infinity_pickaxe:844297732348313620>"
			}
		};

		let pickaxeOrder = ["standard", "stone", "shiny", "lava", "destructive", "diamond", "banana", "steel", "infinity", "none"];
		let myPick = miningData.pickaxe;
		let nextPick = pickaxeOrder[pickaxeOrder.indexOf(myPick) + 1];
		if (nextPick == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't upgrade your pickaxe anymore!" });

		let can = true;
		let needs = [];
		for (let property in pickaxeCosts[nextPick]) {
			if (property != "emote") {
				needs.push(`${pickaxeCosts[nextPick][property]} ${property}`);
				if (miningData[property] < pickaxeCosts[nextPick][property]) can = false;
			}
		}

		if (can == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: `You don't have enough materials to upgrade!\n\n**You need:**\n${needs.join("\n")}` });
		for (let property in pickaxeCosts[nextPick]) {
			if (property != "emote") {
				let has = miningData[property];
				has = Number(has) - Number(pickaxeCosts[nextPick][property]);
				miningData[property] = has;
			}
		}

		let emote = pickaxeCosts[nextPick].emote;
		miningData.pickaxe = nextPick;
		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You upgraded to the **${nextPick}** pickaxe! ${emote} You used:\n${needs.join("\n")}` });

		userData.mining = miningData;
		if (nextPick == "diamond") userData = await achievementAdd(userData, "creeperAwMan");
		if (nextPick == "banana") userData = await achievementAdd(userData, "fruitMining");
		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};