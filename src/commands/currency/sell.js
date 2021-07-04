const findItem = require("../../tools/findItem");

module.exports = {
	name: "sell",
	description: "Sell an item to the shop!",
	argument: "The item you want to sell",
	perms: "Embed Links",
	tips: "You can sell any item you have",
	aliases: ["sellitem"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (!args[0]) return send("You need to specify an item to sell!");
		let stuff = findItem(args);
		let item = stuff[0];
		let amt = stuff[1];
		if (!item) return send("That's not a valid item!");
		if (item.found != "shop" && item.found != "market" && item.found != "limited shop") return send("You can't buy that item from the shop!");

		let itemFormal = item.prof;
		let cost;
		if (item.sell) cost = item.sell;
		else cost = Math.ceil(item.cost / 2);
		if (amt < 1 || amt % 1 != 0) return msg.channel.send("That's not a valid number of items to sell!");
		let userData = data.data();
		if (userData.inv[item.id] === undefined || userData.inv[item.id] < amt) {
			if (amt == 1) return send("You don't have that item!");
			else return send("You don't have that many items!");
		}
		if (userData.donator == 2 && !item.id.startsWith("gift")) cost = Number(cost) + Number(Math.ceil(cost * 0.15));
		let initCost = cost;
		for (let i = 0; i < amt; i++) {
			if (i != 0) cost += initCost;
		}
		let objId = item.id;
		let items = userData["inv"][objId];
		if (items == undefined) items = 0;
		for (let i = 0; i < amt; i++) {
			items--;
		}
		userData["inv"][objId] = items;
		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(cost);
		userData.currencies.cents = bal;
		let extra = "";
		if (userData.donator == 2 && !item.id.startsWith("gift")) extra = "\nSince you're Platinum, you got 15% more!";
		let embed = new discord.MessageEmbed()
			.setTitle(`Congrats, ${msg.author.username}!`)
			.setDescription(`You sold ${amt} ${itemFormal}(s) for ${cost} cents!${extra}`)
			.setColor("GREEN");
		send(embed);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};