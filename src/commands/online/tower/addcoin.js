const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
const achievementAdd = require("../../../tools/achievementAdd");
module.exports = {
	name: "addcoin",
	description: "Add a coin to the CoinTopia Tower!",
	argument: "Optional: how many coins you want to add",
	perms: "",
	tips: "Online has to be enabled to use this, and you need a gold card to do it",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();
		let array = await checkOnline(firestore, msg.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return;

		let amt = Number(args[0]);
		if (isNaN(amt) || amt === undefined) amt = 1;
		if (amt < 1 || amt % 1 != 0) return send("That's not a valid amount of gold cards!");

		let goldcards = userData.inv.goldcard;
		if (goldcards == undefined) goldcards = 0;
		if (goldcards < amt) {
			if (amt == 1) return send("You need a gold card to add a coin to the tower!");
			else return send("You don't have that many gold cards!");
		}
		goldcards = Number(goldcards) - amt;
		userData.inv.goldcard = goldcards;

		let onlinedata = await firestore.doc(`/online/tower`).get();
		let onlineData = onlinedata.data();
		let users = onlineData.users;
		let user = users[msg.author.id];
		if (!user) users[msg.author.id] = 1;
		else users[msg.author.id] = users[msg.author.id] + amt;
		onlineData.users = users;

		let coins = onlineData.coins;
		coins += amt;
		onlineData.coins = coins;

		userData = await achievementAdd(userData, "coinOnTop");

		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/online/tower`).set(onlineData);
		if (amt == 1) send(`You added a coin to the Coin Tower! It now has ${coins} coins!`);
		else send(`You added ${amt} coins to the Coin Tower! It now has ${coins} coins!`);
	}
};