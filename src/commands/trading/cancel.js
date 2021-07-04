const checkTrading = require("../../tools/checkTrading");

module.exports = {
	name: "cancel",
	description: "Cancel the trading session!",
	argument: "None",
	perms: "",
	tips: "",
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		let userData = data.data();
		userData = await checkTrading(firestore, msg.author.id, userData);
		if (userData.trading.session === null) return send("You're not in a trading session!");
		if (msg.guild) return send("Do this in a DM!");

		if (userData.trading.session.loading) return send("The trades are final! You can't cancel!");

		let other = userData.trading.session.other;

		userData.trading.session = null;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		msg.channel.send("You cancelled the trading session!");

		try {
			let otherdata = await firestore.doc(`/users/${other}`).get();
			let otherData = otherdata.data();
			let otherUser = bot.users.cache.get(other);

			otherData.trading.session = null;
			await firestore.doc(`/users/${other}`).set(otherData);
			otherUser.send("The trading session was cancelled!");
		}
		catch {
			msg.channel.send("An error occured. The other user has to cancel the trading session as well.");
		}
	}
};