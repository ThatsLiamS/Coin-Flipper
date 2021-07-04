const check = require("../../tools/check");
module.exports = {
	name: "bugs",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		if (user) {
			await check(firestore, user.id);
			let Data = await firestore.doc(`/users/${user.id}`).get();
			let userData = Data.data();
			let bugs = userData.bugs;
			if (bugs === undefined) bugs = 0;
			send(`<@${user.id}> has ${bugs} bugs!`);
		}
		else {
			let userData = data.data();
			let bugs = userData.bugs;
			if (bugs === undefined) bugs = 0;
			send(`<@${msg.author.id}> has ${bugs} bugs!`);
		}
	}
};