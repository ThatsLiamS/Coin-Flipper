const check = require("../../tools/check");
module.exports = {
	name: "addcents",
	aliases: ["addpoints"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		if (user) {
			await check(firestore, user.id);
			let Data = await firestore.doc(`/users/${user.id}`).get();
			let userData = Data.data();
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(args[0]);
			userData.currencies.cents = bal;
			await firestore.doc(`/users/${user.id}`).set(userData);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} used \`c!addcents\` on ${user.tag}! They added ${args[0]} cents!`).catch(() => {});
		}
		else {
			let userData = data.data();
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(args[0]);
			userData.currencies.cents = bal;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} used \`c!addcents\` on themselves! They added ${args[0]} cents!`).catch(() => {});
		}
	}
};