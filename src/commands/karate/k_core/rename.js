const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "rename",
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		if (!args[1]) {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify what to rename your karate coin!" });
			return;
		}
		let newName = args.slice(1).join(" ");

		if (newName == "NA") {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't name your karate coin `NA` for technical reasons" });
			return;
		}
		if(newName.length > 50) {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "That name is too long!" });
			return;
		}

		kd.name = newName.charAt(0).toUpperCase() + newName.slice(1);
		userData.karate = kd;
		await firebase.doc(`/users/${message.author.id}`).set(userData);
		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You renamed your karate coin ${newName}!` });

	}
};