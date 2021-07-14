const Discord = require('discord.js');

const gotItem = require(`${__dirname}/../../../tools/gotItem`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "buy",
	aliases: ["purchase", "buyitem"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		if (kd.battles.in_battle === true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're in a battle!" });

		if (!args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify an item to buy! (use `c!karate shop`)" });

		let itemList = ["band-aid", "soap", "fuel"];
		let idList = ["bandaid", "soap", "fuel"];
		let emotes = ["🩹", "🧼", "⛽"];
		let costList = [100, 100, 200];
		let item = args[1];

		if (item == "bandaid") item = "band-aid";
		if (!itemList.includes(item)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That isn't a valid item! (use `c!karate shop`)" });

		let amt = args[2];
		if (!amt || isNaN(amt) || amt < 1) amt = 1;
		let cost = costList[itemList.indexOf(item)];
		let initCost = cost;

		for (let i = 0; i < amt; i++) {
			if (i != 0) cost += initCost;
		}
		if (userData.currencies.cents < cost) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have enough cents to buy that!" });

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

		await firebase.doc(`/users/${message.author.id}`).set(userData);

		const emote = emotes[itemList.indexOf(item)];
		const embed = new Discord.MessageEmbed()
			.setTitle(`Congrats, ${message.author.username}!`)
			.setDescription(`You bought ${amt} ${emote} ${item}(s) for ${cost} cents!\nUse \`c!bal\` to see your inventory!`)
			.setColor("RED");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};