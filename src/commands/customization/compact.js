module.exports = {
	name: `compact`,
	description: "Turn on or off compact mode!",
	argument: "`On` or `Off`",
	perms: "",
	tips: "Compact mode makes it so you don't flood the chat!",
	aliases: ["compactmode", "enablecompact", "disablecompact"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (args[0] == "enable" || args[0] == "on") {
			let userData = data.data();
			if (userData.compact == true) return send("You already have compact mode enabled!");
			userData.compact = true;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			send("You enabled **compact mode!**");
		}
		else if (args[0] == "disable" || args[0] == "off") {
			let userData = data.data();
			if (userData.compact === false) return send("You already have compact mode disabled!");
			userData.compact = false;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			send("You disabled **compact mode!**");

		}
		else{
			send("Please specify `on/off`");
		}
	}
};