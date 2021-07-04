module.exports = {
	name: "tradereset",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		let otherdata = await firestore.doc(`/users/${user.id}`).get();
		let otherData = otherdata.data();
		userData.trading.session = null;
		otherData.trading.session = null;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/users/${user.id}`).set(otherData);
	}
};