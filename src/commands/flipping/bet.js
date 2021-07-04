const achievementAdd = require("../../tools/achievementAdd");
module.exports = {
	name: "bet",
	description: "Bet an amount of cents on either heads or tails!",
	argument: "`Heads` or `Tails`, and the amount of cents you want to bet or `All`",
	perms: "Embed Links",
	tips: "If the coin lands on the same side as you bet, you'll get the same amount of cents you bet. Otherwise, you'll lose the amount of cents you bet.",
	aliases: ["gamble"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (!args[1]) return send("Phrase the command like this: `c!bet <heads or tails> <amount>`");
		let betAmt = args[1];
		let userData = data.data();
		let bal = userData.currencies.cents;
		if (isNaN(betAmt) && (betAmt != "all" && betAmt != "max")) return send("You need to bet a *number* of cents");
		let all = betAmt == "all" || betAmt == "max";
		if (betAmt == "all" || betAmt == "max") betAmt = Number(bal);
		else betAmt = Number(args[1]);
		if (bal < betAmt) return send("You don't have that many cents!");
		if (betAmt == undefined || betAmt < 1 || betAmt % 1 != 0) return send("That's not a valid number of cents!");
		let myBet = args[0];
		if (myBet != "heads" && myBet != "tails") return send("You need to bet either heads or tails!");
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
		let embed = new discord.MessageEmbed()
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
		embed.setDescription(decision).setColor('ORANGE');
		send(embed);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};