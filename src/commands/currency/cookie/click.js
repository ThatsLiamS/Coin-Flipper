const Discord = require('discord.js');

const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "click",
	description: "Click and get some cookies!",
	argument: "None",
	perms: "Embed Links",
	cooldown: 1.5,
	cooldowny: "1.5 seconds",
	tips: "You need a cookie to use this",
	aliases: ["cookieclick", "cookieclicker"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (data.data().inv.cookie < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have a cookie :/" });
		let userData = data.data();

		let cookies = userData.currencies.cookies;
		if (cookies == null || cookies == undefined) cookies = 0;

		let amt = Math.ceil(Math.random() * (10 - 5) + 5);
		cookies = Number(cookies) + Number(amt);
		userData.currencies.cookies = cookies;

		if(cookies >= 500) { userData = await achievementAdd(userData, "cookieWizard"); }
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		const embed = new Discord.MessageEmbed()
			.setTitle("🖱️ Click")
			.setDescription(`You clicked and got ${amt} cookies\nYou now have ${cookies} cookies`)
			.setFooter("Btw if you're wondering what you do with cookies do c!complete")
			.setColor("#212121");
		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

	}
};