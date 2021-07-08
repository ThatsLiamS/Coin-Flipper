const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "monthly",
	description: "Claim your monthly cents!",
	argument: "None",
	perms: "",
	cooldowny: "1 month",
	tips: "You need a calendar to use this!",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();

		let date = new Date();
		let thisMonth = date.getMonth();
		let lastMonth = userData.cooldowns.monthly;

		if (userData.inv.calendar < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a calendar to use this command!" });

		if (thisMonth == lastMonth) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can only claim your monthly reward once per month!" });
		userData.cooldowns.monthly = thisMonth;

		let monthAmt = 20000;
		if (userData.donator > 0) monthAmt = 25000;

		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(monthAmt);
		userData.currencies.cents = bal;

		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You claimed your monthly \`${monthAmt}\` cents!` });

	}
};