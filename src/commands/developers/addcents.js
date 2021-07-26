const check = require(`${__dirname}/../../tools/check`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "addcents",
	aliases: ["addpoints"],
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let user = message.mentions.users.first();

		if (user) {
			await check(firebase, user.id);
			let Data = await firebase.doc(`/users/${user.id}`).get();

			let userData = Data.data();
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(args[0]);
			userData.currencies.cents = bal;

			await firebase.doc(`/users/${user.id}`).set(userData);

			const channel = client.channels.cache.get("832245299409846307");
			send.sendChannel({ channel: channel, author: message.author }, { content: `${message.author.tag} with ID ${message.author.id} used \`c!addcents\` on ${user.tag}! They added ${args[0]} cents!` });

		}
		else {
			let userData = data.data();

			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(args[0]);
			userData.currencies.cents = bal;

			await firebase.doc(`/users/${message.author.id}`).set(userData);

			const channel = client.channels.cache.get("832245299409846307");
			send.sendChannel({ channel: channel, author: message.author }, { content: `${message.author.tag} with ID ${message.author.id} used \`c!addcents\` on themself! They added ${args[0]} cents!` });

		}
	}
};