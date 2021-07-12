const Discord = require('discord.js');

const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "cooldowns",
	description: "See what cooldowns you have currently!",
	argument: "None",
	perms: "Embed Links",
	tips: "Some cooldowns have precise ",
	aliases: ["cd"],
	execute: async function(message, args, prefix, client, [, data]) {

		let userData = data.data();
		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username}'s Cooldowns:`)
			.setColor("ORANGE");

		let myCooldowns = {};
		let cooldowns = client.cooldowns;
		let i = message.author.id;
		let d = userData.donator;

		let l = {
			click: ["1.5 seconds", "1.125 seconds", "0.75 seconds"],
			dynamite: ["1 second", "0.75 seconds", "0.5 seconds"],
			mine: ["1 minute", "45 seconds", "30 seconds"],
			daily: ["1 day"],
			monthly: ["1 month"],
			vote: ["1 day"],
			work: ["1 hour"],
			dropship: ["10 seconds", "7.5 seconds", "5 seconds"],
			explore: ["10 seconds", "7.5 seconds", "5 seconds"],
			lottery: ["10 seconds", "7.5 seconds", "5 seconds"],
			ticket: ["10 seconds", "7.5 seconds", "5 seconds"],
			flip: ["1 second", "0.75 seconds", "0.5 seconds"],
			weekly: ["1 week"]
		};

		for (const c in cooldowns) {
			let v = cooldowns[c];
			if (v[i] == true && c != "ticket") {
				let n = l[c];
				if (n.length == 1) n = n[0];
				else n = n[d];
				myCooldowns[c] = n;
			}
		}

		let date = new Date();
		let thisDate = date.getDate();
		let lastDate = userData.cooldowns.daily;
		let pass = false;

		if (userData.inv.vault > 0) {
			if (thisDate != lastDate) userData.cooldowns.claimed = 0;
			let claimed = userData.cooldowns.claimed;
			if (claimed == 0) {
				userData.cooldowns.claimed = 1;
			}
			else if (claimed == 1) {
				userData.cooldowns.claimed = 2;
				pass = true;
			}
		}

		if (thisDate == lastDate && pass == false) myCooldowns["daily"] = l["daily"];

		let thisHour = date.getHours();
		let lastHour = userData.cooldowns.work;

		if (thisHour == lastHour) myCooldowns["work"] = l["work"];

		let thisVote = date.getDate();
		let lastVote = userData.cooldowns.vote;

		if (thisVote == lastVote) myCooldowns["vote"] = l["vote"];

		let thisMonth = date.getMonth();
		let lastMonth = userData.cooldowns.monthly;

		if (thisMonth == lastMonth) myCooldowns["monthly"] = l["monthly"];

		for (const c in myCooldowns) {
			let v = myCooldowns[c];
			embed.addField(c.charAt(0).toUpperCase() + c.slice(1), v);
		}

		if (embed.fields.length == 0) embed.setDescription("No current cooldowns.");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};