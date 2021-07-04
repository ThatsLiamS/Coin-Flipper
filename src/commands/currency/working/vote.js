const dbl = require("dblapi.js");
const mydbl = new dbl(process.env.API_TOKEN, { webhookPort: 5000, webhookAuth: 'password' });

const achievementAdd = require("../../../tools/achievementAdd");

module.exports = {
	name: "vote",
	description: "Vote for the bot and get cents!",
	argument: "None",
	perms: "",
	tips: "You'll have to do the command again after voting to get your reward. It may not register immediately depending on how many people are voting on Topgg",
	aliases: ["voterewards", "voting", "topgg"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		mydbl.hasVoted(msg.author.id).then(async voted => {
			if (voted) {
				let userData = data.data();
				let date = new Date();
				let thisDate = date.getDate();
				let lastDate = userData.cooldowns.voting;
				if (lastDate == thisDate) return send("You already claimed your voting reward today!");
				userData.cooldowns.voting = thisDate;
				let voteAmt = 1000;
				if (userData.donator > 0) voteAmt = 1500;
				let bal = userData.currencies.cents;
				bal = Number(bal) + Number(voteAmt);
				userData.currencies.cents = bal;
				userData = await achievementAdd(userData, "toTheTop");
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
				send(`You voted for the bot and got \`${voteAmt}\` cents!`);
			}
			else {
				send("Vote for the bot here!\nhttps://top.gg/bot/668850031012610050/vote\n\nThen do this command again to claim your cents!");
			}
		});
	}
};