const reset = require("../karate/k_tools/reset");
module.exports = {
	name: "reset",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		let otherdata = await firestore.doc(`/users/${user.id}`).get();
		let otherData = otherdata.data();
		reset(msg.author.id, user.id, userData, otherData, firestore);
	}
};