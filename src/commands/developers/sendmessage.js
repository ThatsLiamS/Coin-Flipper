module.exports = {
	name: "sendmessage",
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		//if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		if (msg.author.id != 821512062999199795) return send("Sorry, only Coin Flipper developers can use this command! (right now only soup because im too lazy to add the other devs manually)");
		let user = await bot.users.fetch(`${args[0]}`);
		let message = args.slice(1).join(" ");
		message = message.charAt(0).toUpperCase() + message.slice(1);
		user.send(message).catch(err => {
			send("An error occured:\n```\n" + err + "\n```");
		});
		send("Sent it!");
	}
};