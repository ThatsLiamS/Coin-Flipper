const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../../tools/checkOnline`);
const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: `sendletter`,
	description: "Send a letter to someone!",
	argument: "The address ID of the user you want to mail",
	perms: "",
	tips: "Online has to be enabled to use this",
	aliases: ["send"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();
		let array = await checkOnline(firebase, message.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return;

		let address = args[0];
		if (!address || !args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!sendletter <address> <letter>`" });

		let onlinedata = await firebase.doc(`/online/codes`).get();
		let onlineData = onlinedata.data();
		let id = onlineData[address];
		if (!id) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not an existing address! To view your address, do `c!address`!" });

		let content = args.slice(1).join(" ");
		let letter = content.charAt(0).toUpperCase() + content.slice(1);
		if (letter.length > 300) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That letter is too long!" });

		let user = client.users.cache.get(id.toString());
		if (user) {
			if (user.bot == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can't send letters to bots smh" });
		}

		let otherdata = await firebase.doc(`/users/${id}`).get();
		let otherData = otherdata.data();
		let mail = otherData.newMail;
		if (mail == undefined) mail = [];
		mail.push(`**Letter**\nFrom: ${message.author.tag}\naddress: ${userData.online.friendCode}\nContent: ${letter}`);
		otherData.newMail = mail;

		userData = await achievementAdd(userData, "penPals");

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		await firebase.doc(`/users/${id}`).set(otherData);

		if (user) send.sendChannel({ channel: message.channel, author: message.author }, { content: `You sent a letter to ${user.tag}!` });
		else send.sendChannel({ channel: message.channel, author: message.author }, { content: `You sent a letter to an unknown user at the address ${address}!` });
	}
};