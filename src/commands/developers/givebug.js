const check = require(`${__dirname}/../../tools/check`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "givebug",
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let user = message.mentions.users.first();
		if (user) {

			await check(firebase, user.id);
			let Data = await firebase.doc(`/users/${user.id}`).get();
			let userData = Data.data();

			if (userData.bugs === undefined) userData.bugs = 0;
			userData.bugs = userData.bugs + 1;

			await firebase.doc(`/users/${user.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You gave <@${user.id}> a bug! They now have ${userData.bugs} bugs!` });

			const channel = client.channels.cache.get("832245299409846307");
			send.sendChannel({ channel: channel, author: message.author }, { content: `${message.author.tag} with ID ${message.author.id} gave ${user.tag} a bug!` });

		}
		else {

			let userData = data.data();
			if (userData.bugs === undefined) userData.bugs = 0;
			userData.bugs = userData.bugs + 1;

			await firebase.doc(`/users/${message.author.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You gave <@${message.author.id}> a bug! You now have ${userData.bugs} bugs!` });

			const channel = client.channels.cache.get("832245299409846307");
			send.sendChannel({ channel: channel, author: message.author }, { content: `${message.author.tag} with ID ${message.author.id} gave themself a bug!` });

		}
	}
};