const turn = require(`${__dirname}/../k_tools/turn`);
module.exports = {
	name: "skip",
	aliases: ["pass"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd, bot) {
		let userData = data.data();
		if (kd.battles.in_battle == false) return send("You're not in a battle!");
		if (kd.battles.turn == false) return send("It's not your turn!");
		send(`<@${msg.author.id}>, you skipped your turn!`);
		turn(msg.author.id, kd.battles.against, userData, firestore, bot);
	}
};