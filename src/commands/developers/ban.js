const check = require("../../tools/check");
module.exports = {
	name: "ban",
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let user = msg.mentions.users.first();
		if (!user) {
			try {
				user = await bot.users.fetch(args[0]);
			}
			catch {
				return send("Unknown user");
			}
		}
		if (!user) return send("You need to specify a user");
		await check(firestore, user.id);
		let userdata = await firestore.doc(`/users/${user.id}`).get();
		let banned = userdata.data().banned;
		if (args[1]) {
			let huh = (args[1] === "true");
			let userDa = userdata.data();
			if (userDa.inv.toolbox == true) return send("You can't ban someone with a toolbox");
			userDa.banned = huh;
			await firestore.doc(`/users/${user.id}`).set(userDa);
			let reason = args.slice(2).join(" ");
			if (!reason) reason = "No reason specified";
			send(`You set <@${user.id}>'s banned status to: \`${huh}\`\nReason: \`${reason}\``);
			if (huh == true) {
				user.send(`<@${user.id}>, you've been banned by ${msg.author.tag}\nReason: \`${reason}\`\n\nWant to appeal? Join the support server:\nhttps://discord.gg/yD5PDYNXcP`).catch(() => {});
			}
			let channel = bot.channels.cache.get("832245299409846307");
			channel.send(`${msg.author.tag} with ID ${msg.author.id} used \`c!ban\` on ${user.tag} with a status of ${huh} and with a reason of ${reason}!`).catch(() => {});
		}
		else {
			send(`<@${user.id}>'s banned status is: \`${banned}\``);
		}
	}
};