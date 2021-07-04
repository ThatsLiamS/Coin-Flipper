const check = require("../../tools/check");
const achievementAdd = require("../../tools/achievementAdd");
module.exports = {
	name: "give",
	description: "Give cents to another user!",
	argument: "A user mention, and the amount of cents you want to give them",
	perms: "",
	tips: "",
	aliases: ["share"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let recipent = msg.mentions.users.first();
		if (!args[1] || !recipent) return send("Phrase the command like this: `c!give @user 10`");
		if (recipent.id == msg.author.id) return send("You cant give cents to yourself :/");
		if (recipent.bot === true) return send("Bots don't have ~~sense~~ cents");
		let amt = args[1];
		if (amt != "all" && amt != "max") {
			amt = Number(amt);
			if (isNaN(amt) || amt < 1) return send("You need to give them a valid number of cents!");
		}
		else { amt = data.data().currencies.cents; }
		let userData = data.data();
		if (userData.currencies.cents < amt) return send(`You don't have ${amt} cents!`);
		await check(firestore, recipent.id);
		let theirdata = await firestore.doc(`/users/${recipent.id}`).get();
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
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/users/${recipent.id}`).set(theirData);
		send(`You gave <@${recipent.id}> ${amt} cents! Now you have ${myNewAmount} cents and they have ${theirNewAmount} cents!${extra}`);
	}
};