const Discord = require('discord.js');

const check = require(`${__dirname}/../../../tools/check`);
const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../../tools/checkOnline`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "address",
	description: "View your or someone else's address!",
	argument: "Optional: a user mention",
	perms: "Embed Links",
	tips: "Online has to be enabled to use this",
	aliases: ["adress", "getaddress", "getadress"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);

		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let user = message.mentions.users.first();
		let userData;
		let username;
		let extra = "";

		if (user) {

			await check(firebase, user.id);

			let userdata = await firebase.doc(`/users/${user.id}`).get();
			userData = userdata.data();
			let array = await checkOnline(firebase, user.id, userData);
			let online = array[0];
			userData = array[1];

			if (online == false) return;

			username = user.username;
			let addressLocal = userData.online.friendCode;
			extra = `\nSend a letter to them using \`c!sendletter ${addressLocal} <content>\`!`;
		}
		else {

			userData = data.data();
			let array = await checkOnline(firebase, message.author.id, userData);
			let online = array[0];
			userData = array[1];

			if (online == false) return;
			username = message.author.username;
		}
		let address = userData.online.friendCode;

		const embed = new Discord.MessageEmbed()
			.setTitle(`🏡 ${username}'s address:`)
			.setDescription(`address ID: ${address}${extra}`)
			.setColor("#c09cff");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};