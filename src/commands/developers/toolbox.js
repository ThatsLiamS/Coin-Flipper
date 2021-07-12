const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "toolbox",
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let user = message.mentions.users.first();
		if (user) {

			let Data = await firebase.doc(`/users/${user.id}`).get();
			let userData = Data.data();

			let bool = (args[0] == "true");
			userData.inv.toolbox = bool;

			await firebase.doc(`/users/${user.id}`).set(userData);
		}
		else {

			let userData = data.data();
			let bool = (args[0] == "true");

			userData.inv.toolbox = bool;

			await firebase.doc(`/users/${message.author.id}`).set(userData);
		}

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `I have changed ${user ? user : message.author}'s tookbox status` });
	}
};