const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "sendmessage",
	developerOnly: true,
	execute: async function(message, args, prefix, client) {

		let user = await client.users.fetch(`${args[0]}`);

		let msg = args.slice(1).join(" ");
		msg = msg.charAt(0).toUpperCase() + msg.slice(1);

		user.send(msg).catch(err => {
			send("An error occurred:\n```\n" + err + "\n```");
		});

		send.sendChannel({ channel: message.channel, author: message.author }, { content: 'I have sent it.' });

	}
};