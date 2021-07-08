const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "deposit",
	description: "Deposit some of your cents into your register!",
	argument: "The amount of cents you want to deposit or `All`",
	perms: "",
	tips: "You need a key to use this",
	aliases: ["dep"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.inv.key < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a key to use this command!" });
		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify an amount of cents to deposit!" });

		let amt = args[0];
		if ((amt != "all" && amt != "max") && (isNaN(amt) || amt < 0)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "It has to be a number" });

		let bal = userData.currencies.cents;
		let reg = userData.currencies.register;

		if (bal < amt) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that many cents!" });
		let all = (amt == "all");

		if (amt == "all" || amt == "max") amt = Number(bal);
		else amt = Number(amt);
		if (bal == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You have no cents to deposit!" });

		reg = Number(reg) + Number(amt);
		bal = Number(bal) - Number(amt);
		userData.currencies.cents = bal;
		userData.currencies.register = reg;

		if (all) userData = await achievementAdd(userData, "secured");
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You deposited ${amt} cents into the register!` });

	}
};