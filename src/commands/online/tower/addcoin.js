const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../../tools/checkOnline`);
const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "addcoin",
	description: "Add a coin to the CoinTopia Tower!",
	argument: "Optional: how many coins you want to add",
	perms: "",
	tips: "Online has to be enabled to use this, and you need a gold card to do it",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();
		let array = await checkOnline(firebase, message.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return;

		let amt = Number(args[0]);
		if (isNaN(amt) || amt === undefined) amt = 1;
		if (amt < 1 || amt % 1 != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid amount of gold cards!" });

		let goldcards = userData.inv.goldcard;
		if (goldcards == undefined) goldcards = 0;
		if (goldcards < amt) {
			if (amt == 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a gold card to add a coin to the tower!" });
			else return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that many gold cards!" });
		}

		goldcards = Number(goldcards) - amt;
		userData.inv.goldcard = goldcards;

		let onlinedata = await firebase.doc(`/online/tower`).get();
		let onlineData = onlinedata.data();
		let users = onlineData.users;
		let user = users[message.author.id];

		if (!user) users[message.author.id] = 1;
		else users[message.author.id] = users[message.author.id] + amt;
		onlineData.users = users;

		let coins = onlineData.coins;
		coins += amt;
		onlineData.coins = coins;

		userData = await achievementAdd(userData, "coinOnTop");

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		await firebase.doc(`/online/tower`).set(onlineData);

		if (amt == 1) send.sendChannel({ channel: message.channel, author: message.author }, { content: `You added a coin to the Coin Tower! It now has ${coins} coins!` });
		else send.sendChannel({ channel: message.channel, author: message.author }, { content: `You added ${amt} coins to the Coin Tower! It now has ${coins} coins!` });

	}
};