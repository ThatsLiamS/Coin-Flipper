const admin = require("firebase-admin");
module.exports = {
	name: "mail",
	description: "Check your mailbox for new mail!",
	argument: "None",
	perms: "Embed Links",
	tips: "Online has to be enabled to use this",
	aliases: ["mailbox", "letters", "newmail"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let mail = userData.mail;
		let newMail = userData.newMail;
		if (mail == undefined) mail = "You have no mail!";
		let embed = new discord.MessageEmbed()
			.setTitle(`${msg.author.username}'s Mailbox 📫`);
		if (newMail != undefined) {
			embed.addField("New Mail", newMail);
			await firestore.doc(`/users/${msg.author.id}`).update({ "newMail": admin.firestore.FieldValue.delete() });
		}
		else {
			embed.addField("New Mail", "There is none :(");
		}
		embed.setColor("#cfcfcf");
		send(embed);
	}
};