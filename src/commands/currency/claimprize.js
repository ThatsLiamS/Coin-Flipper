const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "claimprize",
	description: "Claim your prize from your lottery ticket!",
	argument: "None",
	perms: "",
	tips: "You have to buy a lottery ticket first before doing this",
	aliases: ["getprize"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.lottery.id == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to play a lottery game using `c!lottery`" });
		if (userData.lottery.won == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you didn't win" });

		let lotteryPrize = userData.lottery.prize;
		if (userData.evil == true) lotteryPrize = Math.ceil(lotteryPrize * 0.85);
		if (userData.donator > 0) lotteryPrize = Math.ceil(lotteryPrize * 1.5);

		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(lotteryPrize);
		userData.currencies.cents = bal;

		userData.lottery.id = 0;
		if (lotteryPrize >= 2000) userData = await achievementAdd(userData, "lucky");

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `Congrats ${message.author}, you won \`${lotteryPrize}\` cents from your ticket!` });

		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};