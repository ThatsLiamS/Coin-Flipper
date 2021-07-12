const check = require(`${__dirname}/../../tools/check`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "bugs",
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let user = message.mentions.users.first();
		if (user) {
			await check(firebase, user.id);
			let Data = await firebase.doc(`/users/${user.id}`).get();

			let userData = Data.data();
			let bugs = userData.bugs;
			if (bugs === undefined) bugs = 0;

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `<@${user.id}> has ${bugs} bugs!` });
		}
		else {
			let userData = data.data();
			let bugs = userData.bugs;
			if (bugs === undefined) bugs = 0;

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `<@${message.author.id}> has ${bugs} bugs!` });
		}

	}
};