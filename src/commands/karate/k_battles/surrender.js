const win = require(`${__dirname}/../k_tools/win`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "surrender",
	aliases: ["cancel", "quit", "forfeit"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();

		if (kd.in_battle == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Um you can't surrender from a game you're not in" });

		let other = client.users.cache.get(kd.battles.against.toString());
		let otherdata = await firebase.doc(`/users/${other.id}`).get();
		let otherData = otherdata.data();

		win(other.id, userData, otherData, firebase, client);
	}
};