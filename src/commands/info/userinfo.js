const Discord = require('discord.js');

const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const convertToEmote = require(`${__dirname}/../../tools/convertToEmote`);
const check = require(`${__dirname}/../../tools/check`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "userinfo",
	description: "Get your user stats!",
	argument: "Optional: a user mention",
	perms: "Embed Links, Use External Emojis",
	tips: "",
	aliases: ["myinfo", "settings", "stats", "stat"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let user = message.mentions.users.first();
		if (!user) user = message.author;

		if (user.bot) return;
		let userData;

		if (user.id != message.author.id) {
			await check(firebase, user.id);
			let Data = await firebase.doc(`/users/${user.id}`).get();
			userData = Data.data();
		}
		else { userData = data.data(); }

		let evil = userData.evil;
		let array = await checkOnline(firebase, user.id, userData);
		userData = array[1];
		let online = array[0];
		let compact = userData.compact;

		if (evil == true) evil = await convertToEmote(true);
		else evil = await convertToEmote(false);

		if (compact == true) compact = await convertToEmote(true);
		else compact = await convertToEmote(false);

		if (online == true) online = await convertToEmote(true);
		else online = await convertToEmote(false);

		if (userData.stats.tradingSessionsCompleted === undefined) userData.stats.tradingSessionsCompleted = 0;

		let donator = userData.donator;
		if (donator == 0) donator = "None";
		else if (donator == 1) donator = "Gold";
		else donator = "Platinum";

		const embed = new Discord.MessageEmbed()
			.setTitle(`${user.username}'s Info:`)
			.addField("Settings", `Evil mode:\n${evil}\nCompact mode:\n${compact}\nOnline mode:\n${online}`)
			.addField("Stats", `Coins flipped: \`${userData.stats.flipped}\`\nMinigames won: \`${userData.stats.minigames_won}\`\nTimes worked: \`${userData.stats.timesWorked}\`\nKarate battles won: \`${userData.stats.timesWon}\`\nTrading sessions completed: \`${userData.stats.tradingSessionsCompleted}\``)
			.addField(`Donator status:`, donator)
			.setColor("#cd7f32");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};