const check = require("../../tools/check");
module.exports = {
	name: "takebug",
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		if (user) {
			await check(firestore, user.id);
			let Data = await firestore.doc(`/users/${user.id}`).get();
			let userData = Data.data();
			if (userData.bugs === undefined) userData.bugs = 0;
			userData.bugs = userData.bugs - 1;
			if (userData.bugs < 0) userData.bugs = 0;
			await firestore.doc(`/users/${user.id}`).set(userData);
			send(`You took a bug from <@${user.id}>! They now have ${userData.bugs} bugs!`);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} took a bug from ${user.tag}!`).catch(() => {});
		}
		else {
			let userData = data.data();
			if (userData.bugs === undefined) userData.bugs = 0;
			userData.bugs = userData.bugs - 1;
			if (userData.bugs < 0) userData.bugs = 0;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			send(`You took a bug from <@${msg.author.id}>! You now have ${userData.bugs} bugs!`);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} took a bug from themself!`).catch(() => {});
		}
	}
};