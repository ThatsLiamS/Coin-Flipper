const achievementAdd = require("../../../tools/achievementAdd");
module.exports = {
	name: "click",
	description: "Click and get some cookies!",
	argument: "None",
	perms: "Embed Links",
	cooldown: 1500,
	cooldowny: "1.5 seconds",
	tips: "You need a cookie to use this",
	aliases: ["cookieclick", "cookieclicker"],
	execute: async function(firestore, args, command, msg, discord, data, send) {

		if (data.data().inv.cookie < 1) return send("You don't have a cookie :/");
		let userData = data.data();
		let cookies = userData.currencies.cookies;
		if (cookies == null || cookies == undefined) cookies = 0;
		let amt = Math.ceil(Math.random() * (10 - 5) + 5);
		cookies = Number(cookies) + Number(amt);
		userData.currencies.cookies = cookies;
		if(cookies >= 500) { userData = await achievementAdd(userData, "cookieWizard"); }
		await firestore.doc(`/users/${msg.author.id}`).set(userData);

		let embed = new discord.MessageEmbed()
			.setTitle("🖱️ Click")
			.setDescription(`You clicked and got ${amt} cookies\nYou now have ${cookies} cookies`)
			.setFooter("Btw if you're wondering what you do with cookies do c!complete")
			.setColor("#212121");
		send(embed);
	}
};