const checkOnline = require("../../tools/checkOnline");
module.exports = {
	name: "plug",
	description: "Plug your cable in and go online!",
	argument: "None",
	perms: "",
	tips: "Online has to be enabled to use this",
	aliases: ["connect", "online"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let array = await checkOnline(firestore, msg.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == true) return send("You're already online!");
		userData.online.online = true;
		send("You're now online!");
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};