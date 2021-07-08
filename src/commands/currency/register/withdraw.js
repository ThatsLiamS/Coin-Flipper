const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "withdraw",
	description: "Withdraw cents from your register!",
	argument: "The amount of cents you want to withdraw or `All`",
	perms: "",
	tips: "You need a key to use this",
	aliases: ["with"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.inv.key < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a key to use this command!" });

		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify an amount of cents to withdraw!" });
		let amt = args[0];
		if ((amt != "all" && amt != "max") && (isNaN(amt) || amt < 0)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "It has to be a valid number" });

		let bal = userData.currencies.cents;
		let reg = userData.currencies.register;

		if (reg < amt) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that many cents in your register!" });
		if (amt == "all" || amt == "max") amt = reg;
		else amt = Number(amt);
		if (reg == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "There's nothing in the register!" });

		reg = Number(reg) - Number(amt);
		bal = Number(bal) + Number(amt);

		userData.currencies.cents = bal;
		userData.currencies.register = reg;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You withdrew ${amt} from the register!` });
	}
};