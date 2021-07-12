const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "plug",
	description: "Plug your cable in and go online!",
	argument: "None",
	perms: "",
	tips: "Online has to be enabled to use this",
	aliases: ["connect", "online"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let array = await checkOnline(firebase, message.author.id, userData);

		let online = array[0];
		userData = array[1];

		if (online == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're already online!" });
		userData.online.online = true;

		send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're now online!" });

		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};