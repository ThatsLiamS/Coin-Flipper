const achievementAdd = require("../../tools/achievementAdd");
module.exports = {
	name: "claimprize",
	description: "Claim your prize from your lottery ticket!",
	argument: "None",
	perms: "",
	tips: "You have to buy a lottery ticket first before doing this",
	aliases: ["getprize"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		if (userData.lottery.id == 0) return send("You need to play a lottery game using `c!lottery`");
		if (userData.lottery.won == false) return send("Sorry, you didn't win");
		let lotteryPrize = userData.lottery.prize;
		if (userData.evil == true) lotteryPrize = Math.ceil(lotteryPrize * 0.85);
		if (userData.donator > 0) lotteryPrize = Math.ceil(lotteryPrize * 1.5);
		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(lotteryPrize);
		userData.currencies.cents = bal;
		userData.lottery.id = 0;
		if (lotteryPrize >= 2000) userData = await achievementAdd(userData, "lucky");
		send(`Congrats <@${msg.author.id}>, you won \`${lotteryPrize}\` cents from your ticket!`);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};