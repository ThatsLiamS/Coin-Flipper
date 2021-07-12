const check = require(`${__dirname}/../../tools/check`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "ban",
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase]) {

		let user = message.mentions.users.first();
		if (!user) {
			try {
				user = await client.users.fetch(args[0]);
			}
			catch {
				return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Unknown user" });
			}
		}
		if (!user) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify a user" });

		await check(firebase, user.id);
		let userdata = await firebase.doc(`/users/${user.id}`).get();
		let banned = userdata.data().banned;

		if (args[1]) {
			let huh = (args[1] === "true");
			let userDa = userdata.data();
			if (userDa.inv.toolbox == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't ban someone with a toolbox" });

			userDa.banned = huh;
			await firebase.doc(`/users/${user.id}`).set(userDa);

			let reason = args.slice(2).join(" ");
			if (!reason) reason = "No reason specified";

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You set <@${user.id}>'s banned status to: \`${huh}\`\nReason: \`${reason}\`` });

			if (huh == true) {
				send.sendUser(user, { content: `<@${user.id}>, you've been banned from using me by ${message.author.tag}\nReason: \`${reason}\`\n\nDo you want to appeal? Join the support server:\nhttps://discord.gg/yD5PDYNXcP` });

			}
			const channel = client.channels.cache.get("832245299409846307");
			send.sendChannel({ channel: channel, author: message.author }, { content: `${message.author.tag} with ID ${message.author.id} used \`c!ban\` on ${user.tag} with a status of ${huh} and with a reason of ${reason}!` });
		}
		else {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: `<@${user.id}>'s banned status is: \`${banned}\`` });
		}
	}
};