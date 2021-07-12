const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: `compact`,
	description: "Turn on or off compact mode!",
	argument: "`On` or `Off`",
	perms: "",
	tips: "Compact mode makes it so you don't flood the chat!",
	aliases: ["compactmode", "enablecompact", "disablecompact"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (args[0] == "enable" || args[0] == "on") {
			let userData = data.data();
			if (userData.compact == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have compact mode enabled!" });
			userData.compact = true;

			await firebase.doc(`/users/${message.author.id}`).set(userData);
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "You enabled **compact mode!**" });
		}
		else if (args[0] == "disable" || args[0] == "off") {
			let userData = data.data();
			if (userData.compact === false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have compact mode disabled!" });
			userData.compact = false;

			await firebase.doc(`/users/${message.author.id}`).set(userData);
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "You disabled **compact mode!**" });

		}
		else{
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "Please specify `on/off`" });

		}
	}
};