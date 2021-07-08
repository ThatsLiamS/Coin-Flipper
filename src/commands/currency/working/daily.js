const Discord = require('discord.js');

const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "daily",
	description: "Get your daily cents!",
	argument: "None",
	perms: "Embed Links",
	cooldowny: "1 day",
	tips: "",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let date = new Date();
		let thisDate = date.getDate();
		let lastDate = userData.cooldowns.daily;
		let pass = false;

		if (userData.inv.vault > 0) {
			if (thisDate != lastDate) userData.cooldowns.claimed = 0;
			let claimed = userData.cooldowns.claimed;
			if(claimed == 0) {
				userData.cooldowns.claimed = 1;
			}
			else if (claimed == 1) {
				userData.cooldowns.claimed = 2;
				pass = true;
			}
		}

		if (thisDate == lastDate && pass == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You can only claim your daily reward once per day!" });
		userData.cooldowns.daily = thisDate;

		let randomAmt = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;
		if (userData.donator > 0) randomAmt = Math.ceil(randomAmt * 1.5);

		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(randomAmt);
		userData.currencies.cents = bal;

		await firebase.doc(`/users/${message.author.id}`).set(userData);

		const embed = new Discord.MessageEmbed()
			.setTitle(`You claimed your daily reward!`)
			.setDescription(`You got \`${randomAmt}\` cents!\nMake sure to come back tomorrow to claim your next one!\nIf you want 1000 more cents, vote for the bot with \`c!vote\`!`)
			.setColor("GREEN");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};