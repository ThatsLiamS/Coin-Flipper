const checkTrading = require(`${__dirname}/../../tools/checkTrading`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "cancel",
	description: "Cancel the trading session!",
	argument: "None",
	perms: "",
	tips: "",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		userData = await checkTrading(firebase, message.author.id, userData);
		if (userData.trading.session === null) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're not in a trading session!" });
		if (message.guild) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Do this in a DM!" });

		if (userData.trading.session.loading) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "The trades are final! You can't cancel!" });

		let other = userData.trading.session.other;

		userData.trading.session = null;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: "You cancelled the trading session!" });

		try {
			let otherdata = await firebase.doc(`/users/${other}`).get();
			let otherData = otherdata.data();
			let otherUser = client.users.cache.get(other);

			otherData.trading.session = null;
			await firebase.doc(`/users/${other}`).set(otherData);
			otherUser.send("The trading session was cancelled!");
		}
		catch {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "An error occured. The other user has to cancel the trading session as well." });
		}
	}
};