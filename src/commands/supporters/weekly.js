module.exports = {
	name: "weekly",
	description: "Claim your weekly donator cents!",
	argument: "None",
	perms: "",
	cooldowny: "1 week",
	tips: "Only donators can use this - different tiers get different amounts of cents, and all of them get at least 25,000",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();

		let now = new Date();
		let onejan = new Date(now.getFullYear(), 0, 1);
		let thisWeek = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
		let lastWeek = userData.cooldowns.weekly;

		let amt = 0;

		if (userData.donator == 0) return send("You must be a donator or server booster to use this command!");
		if (userData.donator == 1) amt = 25000;
		if (userData.donator == 2) amt = 75000;

		let extra = " You can claim it on Sunday!";
		if (now.getDay() == 0) extra = " You can claim it again next Sunday!";
		if (thisWeek == lastWeek) return send(`You can only claim your weekly reward once per week!${extra}`);
		userData.cooldowns.weekly = thisWeek;

		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(amt);
		userData.currencies.cents = bal;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You claimed your weekly ${amt} cents! Thanks for donating to Coin Flipper!`);
	}
};