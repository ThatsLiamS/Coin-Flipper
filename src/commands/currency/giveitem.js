const check = require("../../tools/check");
const itemlist = require("../../tools/constants").itemlist;
const gotItem = require("../../tools/gotItem");
module.exports = {
	name: "giveitem",
	description: "Give an item to another user!",
	argument: "A user mention, and the item you want to give them",
	perms: "",
	aliases: ["gift", "giftitem"],
	tips: "",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let recipent = msg.mentions.users.first();
		if (!recipent) {
			recipent = msg.guild.members.cache.get(args[0]);
			if (!recipent) {
				recipent = msg.guild.members.cache.find(m => m.user.tag == args[0]);
				if (recipent) recipent = recipent.user;
			}
			else { recipent = recipent.user; }
		}
		if (!args[1] || !recipent) return send("Phrase the command like this: `c!giveitem @user <item>`");
		if (recipent.id == msg.author.id) return send("You cant give an item to yourself :/");
		if (recipent.bot == true) return send("Why are you trying to give an item to a bot?");
		let itemName = args[1];
		let item;
		function findItem() {
			for (let i of itemlist) {
				if (i.name == itemName) item = i;
				if (i.aliases.includes(itemName)) item = i;
			}
		}
		let done = false;
		for (let i = 1; i < 6; i++) {
			if (done == false) {
				itemName = args.slice(1, i + 1).join(" ");
				findItem();
				if (item !== undefined) done = true;
			}
		}
		if (!item) return send("That's not a valid item!");
		let amt = Number(args[2]);
		if (isNaN(amt) || amt === undefined) amt = Number(args[3]);
		if (isNaN(amt) || amt === undefined) amt = Number(args[4]);
		if (isNaN(amt) || amt === undefined) amt = Number(args[5]);
		if (isNaN(amt) || amt === undefined) amt = Number(args[6]);
		if (isNaN(amt) || amt === undefined) amt = 1;

		let itemFormal = item.prof;
		let objItem = item.id;
		let userData = data.data();
		if (amt < 1 || amt % 1 != 0) return send("That's not a valid number of items to give them!");
		if (userData["inv"][objItem] < amt) return msg.channel.send("You don't have that item!");
		await check(firestore, recipent.id);
		let theirdata = await firestore.doc(`/users/${recipent.id}`).get();
		let theirData = theirdata.data();
		if (theirData["inv"][objItem] === undefined) theirData["inv"][objItem] = 0;
		let myNewAmount = Number(userData["inv"][objItem]) - Number(amt);
		let theirNewAmount;
		if (objItem == "pin") {
			let theirAmountRN = Number(theirData["inv"]["pingiven"]);
			if (isNaN(theirAmountRN) || theirAmountRN === undefined) theirAmountRN = 0;
			theirNewAmount = Number(theirAmountRN) + Number(amt);
			theirData["inv"]["pingiven"] = theirNewAmount;
		}
		else {
			theirNewAmount = Number(theirData["inv"][objItem]) + Number(amt);
			theirData["inv"][objItem] = theirNewAmount;
		}
		userData["inv"][objItem] = myNewAmount;
		theirData = await gotItem(theirData);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/users/${recipent.id}`).set(theirData);
		send(`You gave ${recipent.tag} ${amt} ${itemFormal}(s)! Now you have ${myNewAmount} and they have ${theirNewAmount}!`);
	}
};