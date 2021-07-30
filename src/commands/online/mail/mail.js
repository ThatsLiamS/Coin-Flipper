const admin = require("firebase-admin");
const Discord = require('discord.js');

const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "mail",
	description: "Check your mailbox for new mail!",
	argument: "None",
	perms: "Embed Links",
	tips: "Online has to be enabled to use this",
	aliases: ["mailbox", "letters", "newmail"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let mail = userData.mail;
		let newMail = userData.newMail;
		if (mail == undefined) mail = "You have no mail!";

		const embed = new Discord.MessageEmbed()
			.setColor("#cfcfcf")
			.setTitle(`${message.author.username}'s Mailbox 📫`);

		if (newMail != undefined) {
			embed.addField("New Mail", newMail.join('\n').toString());
			await firebase.doc(`/users/${message.author.id}`).update({ "newMail": admin.firestore.FieldValue.delete() });
		}
		else {
			embed.addField("New Mail", "There is none :(");
		}


		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};