const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "forget",
	aliases: ["disown"],
	execute: async function(message, args, prefix, client, kd, [firebase]) {

		return;

		/*   MAJOR ISSUE - we sort in the future

		let userData = {};

		send.sendChannel({ channel: message.channel, author: message.author }, { content: "Are you sure you want to forget your karate coin? This cannot be undone.\n\nReply with `yes` or `no`" });

		message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000 }).then(async collected => {
			if (!collected.first()) {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't answer :/" });
				return;
			}

			let msg = collected.first().content.toLowerCase();
			if (msg == "yes") {

				kd.name = "NA";
				userData.karate = kd;

				await firebase.doc(`/users/${message.author.id}`).set(userData);

				send.sendChannel({ channel: message.channel, author: message.author }, { content: `You forgot your karate coin! What was it's name again?\nAnyway, use \`c!karate setup\` to make a new one!` });

			}
			else {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phew, crisis averted" });

			}

		});
		*/
	}
};