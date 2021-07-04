module.exports = {
	name: "monthly",
	description: "Claim your monthly cents!",
	argument: "None",
	perms: "",
	cooldowny: "1 month",
	tips: "You need a calendar to use this!",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();

		let date = new Date();
		let thisMonth = date.getMonth();
		let lastMonth = userData.cooldowns.monthly;

		if (userData.inv.calendar < 1) return send("You need a calendar to use this command!");

		if (thisMonth == lastMonth) return send("You can only claim your monthly reward once per month!");
		userData.cooldowns.monthly = thisMonth;

		let monthAmt = 20000;
		if (userData.donator > 0) monthAmt = 25000;
		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(monthAmt);
		userData.currencies.cents = bal;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You claimed your monthly \`${monthAmt}\` cents!`);
	}
};