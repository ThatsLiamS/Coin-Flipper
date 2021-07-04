const checkOnline = require("../../tools/checkOnline");
module.exports = {
	name: "unplug",
	description: "Unplug your cable and go offline!",
	argument: "None",
	perms: "",
	tips: "Being offline doesn't let you use any CoinTopia or mail commands.",
	aliases: ["unconnect", "offline"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let array = await checkOnline(firestore, msg.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return send("You're already offline!");
		userData.online.online = false;
		send("You're now offline!");
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};