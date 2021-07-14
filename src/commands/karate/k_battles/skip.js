const turn = require(`${__dirname}/../k_tools/turn`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "skip",
	aliases: ["pass"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		if (kd.battles.in_battle == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're not in a battle!" });
		if (kd.battles.turn == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content:  "It's not your turn!" });

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `${message.author}, you skipped your turn!` });

		turn(message.author.id, kd.battles.against, userData, firebase, client);
	}
};