const check = require("../../tools/check");
module.exports = {
	name: "givebadge",
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		if (user) {
			await check(firestore, user.id);
			let Data = await firestore.doc(`/users/${user.id}`).get();
			let userData = Data.data();
			userData["badges"][args[0]] = true;
			await firestore.doc(`/users/${user.id}`).set(userData);
			send(`You gave <@${user.id}> the badge!`);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} gave ${user.tag} the ${args[0]} badge!`).catch(() => {});
		}
		else {
			let userData = data.data();
			userData["badges"][args[0]] = true;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			send(`You gave <@${msg.author.id}> the badge!`);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} gave themselves the ${args[0]} badge!`).catch(() => {});
		}
	}
};