const Discord = require('discord.js');

const gotAddon = require("../../tools/gotAddon");
const gotItem = require("../../tools/gotItem");
const findItem = require("../../tools/findItem");
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "buy",
	description: "Buy an item from the shop!",
	argument: "The item you want to buy",
	perms: "Embed Links",
	tips: "You can buy items from the normal shop or CoinTopia market",
	aliases: ["purchase", "buyitem"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify an item to buy!" });
		let stuff = findItem(args);
		let item = stuff[0];
		let amt = stuff[1];
		if (!item) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid item!" });
		if (item.found != "shop" && item.found != "market" && item.found != "limited shop") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't buy that item from the shop!" });

		let itemFormal = item.prof;
		let cost = item.cost;
		if (amt < 1 || amt % 1 != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid number of items to buy!" });

		let userData = data.data();
		if (userData.donator == 2 && !item.id.startsWith("gift")) cost = Number(cost) - Number(Math.ceil(cost * 0.25));
		let initCost = cost;
		for (let i = 0; i < amt; i++) {
			if (i != 0) cost += initCost;
		}
		if (userData.currencies.cents < cost) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have enough cents to buy this item!" });
		let objId = item.id;
		let items = userData["inv"][objId];
		if (items == undefined) items = 0;
		for (let i = 0; i < amt; i++) {
			items++;
		}
		userData["inv"][objId] = items;
		let bal = userData.currencies.cents;
		bal = Number(bal) - Number(cost);
		userData.currencies.cents = bal;

		const embed = new Discord.MessageEmbed()
			.setTitle(`Congrats, ${message.author.username}!`)
			.setDescription(`You bought ${amt} ${itemFormal}(s) for ${cost} cents!\nUse \`c!inv\` to see your inventory!`)
			.setColor("GREEN");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

		userData = await gotAddon(userData);
		userData = await gotItem(userData);

		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};