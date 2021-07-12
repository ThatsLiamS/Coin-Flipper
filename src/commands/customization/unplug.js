const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "unplug",
	description: "Unplug your cable and go offline!",
	argument: "None",
	perms: "",
	tips: "Being offline doesn't let you use any CoinTopia or mail commands.",
	aliases: ["unconnect", "offline"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let array = await checkOnline(firebase, message.author.id, userData);

		let online = array[0];
		userData = array[1];
		if (online == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're already offline!" });

		userData.online.online = false;

		send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're now offline!" });
		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};