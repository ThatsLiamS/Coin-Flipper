const gotItem = require("../../../tools/gotItem");
module.exports = {
	name: "buy",
	aliases: ["purchase", "buyitem"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd) {
		let userData = data.data();
		if (kd.battles.in_battle === true) return send("You're in a battle!");
		if (!args[1]) return send("You need to specify an item to buy! (use `c!karate shop`)");
		let itemList = ["band-aid", "soap", "fuel"];
		let idList = ["bandaid", "soap", "fuel"];
		let emotes = ["🩹", "🧼", "⛽"];
		let costList = [100, 100, 200];
		let item = args[1];
		if (item == "bandaid") item = "band-aid";
		if (!itemList.includes(item)) return send("That isn't a valid item! (use `c!karate shop`)");
		let amt = args[2];
		if (!amt || isNaN(amt) || amt < 1) amt = 1;
		let cost = costList[itemList.indexOf(item)];
		let initCost = cost;
		for (let i = 0; i < amt; i++) {
			if (i != 0) cost += initCost;
		}
		if (userData.currencies.cents < cost) return send("You don't have enough cents to buy that!");
		let bal = userData.currencies.cents;
		bal = Number(bal) - Number(cost);
		userData.currencies.cents = bal;
		let idItem = idList[itemList.indexOf(item)];
		let items = userData["inv"][idItem];
		for (let i = 0; i < amt; i++) {
			items = Number(items) + Number(1);
		}
		userData["inv"][idItem] = items;
		userData.karate = kd;
		userData = await gotItem(userData);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		let emote = emotes[itemList.indexOf(item)];
		let embed = new discord.MessageEmbed()
			.setTitle(`Congrats, ${msg.author.username}!`)
			.setDescription(`You bought ${amt} ${emote} ${item}(s) for ${cost} cents!\nUse \`c!bal\` to see your inventory!`)
			.setColor("RED");
		send(embed);
	}
};