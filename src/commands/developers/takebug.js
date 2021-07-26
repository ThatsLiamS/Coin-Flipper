const check = require(`${__dirname}/../../tools/check`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "takebug",
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let user = message.mentions.users.first();
		if (user) {

			await check(firebase, user.id);

			let Data = await firebase.doc(`/users/${user.id}`).get();
			let userData = Data.data();
			if (userData.bugs === undefined) userData.bugs = 0;
			userData.bugs = userData.bugs - 1;

			if (userData.bugs < 0) userData.bugs = 0;
			await firebase.doc(`/users/${user.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You took a bug from <@${user.id}>! They now have ${userData.bugs} bugs!` });

			const channel = client.channels.cache.get("832245299409846307");
			channel.send(`${message.author.tag} with ID ${message.author.id} took a bug from ${user.tag}!`).catch(() => {});
		}
		else {
			let userData = data.data();
			if (userData.bugs === undefined) userData.bugs = 0;
			userData.bugs = userData.bugs - 1;
			if (userData.bugs < 0) userData.bugs = 0;

			await firebase.doc(`/users/${message.author.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You took a bug from <@${message.author.id}>! You now have ${userData.bugs} bugs!` });

			const channel = client.channels.cache.get("832245299409846307");
			channel.send(`${message.author.tag} with ID ${message.author.id} took a bug from them self!`).catch(() => {});
		}
	}
};