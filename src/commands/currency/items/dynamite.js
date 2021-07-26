const Discord = require('discord.js');

const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "dynamite",
	description: "Blow up the chat with your dynamite!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	cooldown: 1000,
	cooldowny: "1 second",
	tips: "",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let dynamite = userData.inv.dynamite;
		if (dynamite === undefined) dynamite = 0;
		if (dynamite < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "I'm sorry, you do not have that item." });

		const embed = new Discord.MessageEmbed()
			.setTitle(`KABOOM`)
			.setDescription("You got 250 cents!")
			.setImage("https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif")
			.setColor("RED");

		userData.currencies.cents = Number(userData.currencies.cents) + Number(250);
		userData = await achievementAdd(userData, "kaboom");
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};