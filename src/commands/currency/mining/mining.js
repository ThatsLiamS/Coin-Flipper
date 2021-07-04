const checkMining = require("../../../tools/checkMining");
const achievementAdd = require("../../../tools/achievementAdd");
const check = require("../../../tools/check");
module.exports = {
	name: "mining",
	description: "View your mining stats!",
	argument: "None",
	perms: "Embed Links",
	aliases: ["miningdata", "mininginv", "mineinv", "mininginventory", "geminventory", "geminv", "crystalinv", "crystalinventory", "minedata", "mineinventory", "miningstats", "minestats"],
	tips: "You can only use this if you have a pickaxe!",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let user = msg.mentions.users.first();
		if (!user) user = msg.author;
		if (user.bot) return send("How can bots mine");
		let userData;
		if (user.id != msg.author.id) {
			await check(firestore, user.id);
			let Data = await firestore.doc(`/users/${user.id}`).get();
			userData = Data.data();
		}
		else { userData = data.data(); }
		if (data.data().inv.pickaxe < 1 || data.data().inv.pickaxe === undefined) return send("You need a pickaxe to use this!");
		userData = await checkMining(firestore, msg.author, userData);
		let miningData = userData.mining;
		let stuff = [];
		let properties = ["rock", "sapphire", "ruby", "opal", "diamond"];
		for (let property of properties) {
			stuff.push(`${miningData[property]} ${property}`);
		}
		if (miningData.banana > 0) stuff.push(`${miningData.banana} banana`);
		if (miningData.steel > 0) stuff.push(`${miningData.steel} steel`);
		if (miningData.infinitystone > 0) stuff.push(`${miningData.infinitystone} infinity stone`);
		let emotes = {
			standard: "⛏️",
			stone: "<:stone_pickaxe:839207778672443412>",
			shiny: "<:shiny_pickaxe:839207778660778004>",
			lava: "<:lava_pickaxe:839208806566592532>",
			destructive: "<:destructive_pickaxe:839207778585280553>",
			diamond: "<:diamond_pickaxe:839207779092267018>",
			banana: "<:banana_pickaxe:839207778479505408>",
			steel: "<:steel_pickaxe:844307964093136907>",
			infinity: "<:infinity_pickaxe:844297732348313620>"
		};
		let emote = emotes[miningData.pickaxe];
		let embed = new discord.MessageEmbed()
			.setTitle(`${user.username}'s Mining Data`)
			.addField("Pickaxe", `${miningData.pickaxe} pickaxe ${emote}`)
			.addField("Inventory", stuff)
			.setColor("#ababab")
			.setFooter("Thanks to Mr Spooky#6088 for making the pickaxe emojis!");
		if (miningData.pickaxe == "diamond" || miningData.pickaxe == "banana") {
			if (miningData.pickaxe == "diamond") {
				let localData = await achievementAdd(userData, "creeperAwMan", true);
				if (localData) {
					userData = localData;
					await firestore.doc(`/users/${msg.author.id}`).set(userData);
				}
			}
			else {
				let localData = await achievementAdd(userData, "fruitMining", true);
				if (localData) {
					userData = localData;
					await firestore.doc(`/users/${msg.author.id}`).set(userData);
				}
			}
		}
		send(embed);
	}
};