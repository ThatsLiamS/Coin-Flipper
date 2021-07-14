const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../../tools/checkOnline`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "tower",
	description: "View the CoinTopia Tower!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	tips: "Online has to be enabled to use this",
	aliases: ["cointower"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();
		let array = await checkOnline(firebase, message.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return;

		let onlinedata = await firebase.doc(`/online/tower`).get();
		let onlineData = onlinedata.data();
		let highestAmt = 0;
		let highestUsers = [];
		let users = onlineData.users;
		for (let user in users) {
			let coins = users[user];
			if (coins == highestAmt) {
				highestUsers.push(user);
			}
			else if (coins > highestAmt) {
				highestAmt = coins;
				highestUsers = [user];
			}
		}

		let coinStackers = [];

		for (const user of highestUsers) {
			let localUser = client.users.cache.get(user.toString());
			let tag;
			try {
				tag = localUser.tag;
			}
			catch {
				tag = "Unknown User";
			}
			coinStackers.push(`${tag}: ${users[user]} coins`);
		}

		let coins = onlineData.coins;
		let yours = users[message.author.id];
		if (yours == undefined) yours = 0;

		const embed = new Discord.MessageEmbed()
			.setTitle("The Coin Tower")
			.setDescription("How big can it get?")
			.addField("Tower", `The tower currently has ${coins} coins!`)
			.addField("Your Coins", `You have added ${yours} coins to the tower`)
			.addField("Best Coinstackers", coinStackers)
			.setColor("#5500ff")
			.setThumbnail("https://imgur.com/ClVbaOe.png");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};