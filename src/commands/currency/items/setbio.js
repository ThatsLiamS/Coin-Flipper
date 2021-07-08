const profanityCheck = require(`${__dirname}/../../../tools/profanities`).profanityCheck;
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "setbio",
	description: "Set a message that will be seen on your balance!",
	argument: "What you want to set it to",
	perms: "",
	tips: "",
	aliases: ["bio", "setbal", "setmessage"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.inv.paper === undefined || userData.inv.paper == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you don't have a piece of paper." });
		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You have to specify the bio you want!" });

		let bio = args.slice(0).join(" ");
		bio = bio.charAt(0).toUpperCase() + bio.slice(1);

		if (profanityCheck(bio) == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't have profanities!" });
		if (bio.length > 150) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That bio is too long!" });

		userData.stats.bio = bio;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You set your bio to: \`${bio}\`` });

	}
};