module.exports = {
	name: "forget",
	aliases: ["disown"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd) {
		send("Are you sure you want to forget your karate coin? This cannot be undone.\n\nReply with `yes` or `no`");
		msg.channel.awaitMessages(m => m.author.id == msg.author.id, { max: 1, time: 30000 }).then(async collected => {
			if (!collected.first()) {
				send("You didn't answer :/");
				return;
			}
			let message = collected.first().content.toLowerCase();
			if (message == "yes") {
				kd.name = "NA";
				userData.karate = kd;
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
				send(`You forgot your karate coin! What was it's name again?\nAnyway, use \`c!karate setup\` to make a new one!`);
			}
			else {
				send("Phew, crisis averted");
			}
		});
	}
};