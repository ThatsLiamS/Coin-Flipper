const check = require("../../../tools/check");
const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
module.exports = {
	name: "address",
	description: "View your or someone else's address!",
	argument: "Optional: a user mention",
	perms: "Embed Links",
	tips: "Online has to be enabled to use this",
	aliases: ["adress", "getaddress", "getadress"],
	execute: async function(firestore, args, command, msg, discord, data, send) {

		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let user = msg.mentions.users.first();
		let userData;
		let username;
		let extra = "";
		if (user) {
			await check(firestore, user.id);
			let userdata = await firestore.doc(`/users/${user.id}`).get();
			userData = userdata.data();
			let array = await checkOnline(firestore, user.id, userData);
			let online = array[0];
			userData = array[1];
			if (online == false) return;
			username = user.username;
			let addressLocal = userData.online.friendCode;
			extra = `\nSend a letter to them using \`c!sendletter ${addressLocal} <content>\`!`;
		}
		else {
			userData = data.data();
			let array = await checkOnline(firestore, msg.author.id, userData);
			let online = array[0];
			userData = array[1];
			if (online == false) return;
			username = msg.author.username;
		}

		let address = userData.online.friendCode;
		let embed = new discord.MessageEmbed()
			.setTitle(`🏡 ${username}'s address:`)
			.setDescription(`address ID: ${address}${extra}`)
			.setColor("#c09cff");
		send(embed);
	}
};