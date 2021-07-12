const Discord = require('discord.js');

const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "bet",
	description: "Bet an amount of cents on either heads or tails!",
	argument: "`Heads` or `Tails`, and the amount of cents you want to bet or `All`",
	perms: "Embed Links",
	tips: "If the coin lands on the same side as you bet, you'll get the same amount of cents you bet. Otherwise, you'll lose the amount of cents you bet.",
	aliases: ["gamble"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (!args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!bet <heads or tails> <amount>`" });
		let betAmt = args[1];
		let userData = data.data();
		let bal = userData.currencies.cents;

		if (isNaN(betAmt) && (betAmt != "all" && betAmt != "max")) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to bet a *number* of cents" });

		let all = betAmt == "all" || betAmt == "max";
		if (betAmt == "all" || betAmt == "max") betAmt = Number(bal);
		else betAmt = Number(args[1]);

		if (bal < betAmt) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that many cents!" });
		if (betAmt == undefined || betAmt < 1 || betAmt % 1 != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid number of cents!" });

		let myBet = args[0];
		if (myBet != "heads" && myBet != "tails") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to bet either heads or tails!" });

		let output = "none";
		let simpleOut = "none";
		let randomOut = Math.random() * 100;
		let needed = 50;

		if (userData.inv.chart !== undefined && userData.inv.chart > 0) {
			if (myBet == "heads") needed = 45;
			else needed = 55;
		}
		if (randomOut > needed) {
			output = "The coin landed on heads";
			simpleOut = "heads";
		}
		else{
			output = "The coin landed on tails";
			simpleOut = "tails";
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(output);

		let decision = "none";
		if (myBet == simpleOut) {

			decision = `You got ${betAmt} cents!`;
			if (userData.evil == true) betAmt = Math.ceil(betAmt * 0.75);
			bal = Number(bal) + Number(betAmt);
			userData.currencies.cents = bal;
		}
		else{

			decision = `You lost ${betAmt} cents...`;
			bal = Number(bal) - Number(betAmt);
			if (bal < 0) bal = 0;
			userData.currencies.cents = bal;
			if (all) userData = await achievementAdd(userData, "justMyLuck");
		}

		embed.setDescription(decision);
		embed.setColor('ORANGE');

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};