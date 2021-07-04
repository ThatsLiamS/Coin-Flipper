const win = require(`${__dirname}/../k_tools/win`);
module.exports = {
	name: "surrender",
	aliases: ["cancel", "quit", "forfeit"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd, bot) {
		let userData = data.data();
		if (kd.in_battle == false) return send("Um you can't surrender from a game you're not in");
		let other = bot.users.cache.get(kd.battles.against.toString());
		let otherdata = await firestore.doc(`/users/${other.id}`).get();
		let otherData = otherdata.data();
		win(other.id, userData, otherData, firestore, bot);
	}
};