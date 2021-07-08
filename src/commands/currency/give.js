const check = require(`${__dirname}/../../tools/check`);
const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "give",
	description: "Give cents to another user!",
	argument: "A user mention, and the amount of cents you want to give them",
	perms: "",
	tips: "",
	aliases: ["share"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let recipent = message.mentions.users.first();
		if (!args[1] || !recipent) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!give @user 10`" });
		if (recipent.id == message.author.id) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You cant give cents to yourself :/" });
		if (recipent.bot === true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Bots don't have ~~sense~~ cents" });

		let amt = args[1];
		if (amt != "all" && amt != "max") {
			amt = Number(amt);
			if (isNaN(amt) || amt < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to give them a valid number of cents!" });
		}
		else {
			amt = data.data().currencies.cents;
		}

		let userData = data.data();
		if (userData.currencies.cents < amt) return send.sendChannel({ channel: message.channel, author: message.author }, { content: `You don't have ${amt} cents!` });
		await check(firebase, recipent.id);

		let theirdata = await firebase.doc(`/users/${recipent.id}`).get();
		let theirData = theirdata.data();
		let giveData = userData.giveData;
		if (giveData === undefined) {
			giveData = {
				users: 0,
				cents: 0
			};
		}

		let users = giveData.users;
		let extra = "";
		let thisUser = giveData[recipent.id];
		if (thisUser === undefined) thisUser = 0;
		thisUser++;
		if (thisUser == 1) giveData.users++;

		let cents = giveData.cents;
		cents += amt;
		giveData.cents = cents;

		if (users >= 5 && cents >= 100000 && userData.badges.niceness !== true) {
			userData.badges.niceness = true;
			extra = "\nYou got the <:niceness_badge:829093670925238293> Niceness badge for giving a total of at least 100,000 cents to at least 5 different users!";
		}

		userData.giveData = giveData;
		let myNewAmount = Number(userData.currencies.cents) - Number(amt);
		let theirNewAmount = Number(theirData.currencies.cents) + Number(amt);

		userData.currencies.cents = myNewAmount;
		theirData.currencies.cents = theirNewAmount;

		if (amt >= 10000) userData = await achievementAdd(userData, "generous");
		if (amt == 1) userData = await achievementAdd(userData, "ungenerous");

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		await firebase.doc(`/users/${recipent.id}`).set(theirData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You gave ${recipent} ${amt} cents! Now you have ${myNewAmount} cents and they have ${theirNewAmount} cents!${extra}` });

	}
};