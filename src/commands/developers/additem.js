const check = require("../../tools/check");
module.exports = {
	name: "additem",
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		if (user) {
			await check(firestore, user.id);
			let Data = await firestore.doc(`/users/${user.id}`).get();
			let userData = Data.data();
			userData["inv"][args[0]] = args[1];
			await firestore.doc(`/users/${user.id}`).set(userData);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} used \`c!additem\` on ${user.tag}! They added ${args[1]} ${args[0]}s!`).catch(() => {});
		}
		else {
			let userData = data.data();
			userData["inv"][args[0]] = args[1];
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} used \`c!additem\` on themselves! They added ${args[1]} ${args[0]}s!`).catch(() => {});
		}
	}
};