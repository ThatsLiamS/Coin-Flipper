const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
const achievementAdd = require("../../../tools/achievementAdd");

module.exports = {
	name: `sendletter`,
	description: "Send a letter to someone!",
	argument: "The address ID of the user you want to mail",
	perms: "",
	tips: "Online has to be enabled to use this",
	aliases: ["send"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();
		let array = await checkOnline(firestore, msg.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return;

		let address = args[0];
		if (!address || !args[1]) return send("Phrase the command like this: `c!sendletter <address> <letter>`");

		let onlinedata = await firestore.doc(`/online/codes`).get();
		let onlineData = onlinedata.data();
		let id = onlineData[address];
		if (!id) return send("That's not an existing address! To view your address, do `c!address`!");

		let content = args.slice(1).join(" ");
		let letter = content.charAt(0).toUpperCase() + content.slice(1);
		if (letter.length > 300) return send("That letter is too long!");

		let user = bot.users.cache.get(id.toString());
		if (user) {
			if (user.bot == true) return send("You can't send letters to bots smh");
		}

		let otherdata = await firestore.doc(`/users/${id}`).get();
		let otherData = otherdata.data();
		let mail = otherData.newMail;
		if (mail == undefined) mail = [];
		mail.push(`**Letter**\nFrom: ${msg.author.tag}\naddress: ${userData.online.friendCode}\nContent: ${letter}`);
		otherData.newMail = mail;

		userData = await achievementAdd(userData, "penPals");

		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/users/${id}`).set(otherData);

		if (user) send(`You sent a letter to ${user.tag}!`);
		else send(`You sent a letter to an unknown user at the address ${address}!`);
	}
};