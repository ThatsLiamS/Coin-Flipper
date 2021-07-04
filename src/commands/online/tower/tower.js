const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
module.exports = {
	name: "tower",
	description: "View the CoinTopia Tower!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	tips: "Online has to be enabled to use this",
	aliases: ["cointower"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();
		let array = await checkOnline(firestore, msg.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return;

		let onlinedata = await firestore.doc(`/online/tower`).get();
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

		for (let user of highestUsers) {
			let localUser = bot.users.cache.get(user.toString());
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
		let yours = users[msg.author.id];
		if (yours == undefined) yours = 0;

		let embed = new discord.MessageEmbed()
			.setTitle("The Coin Tower")
			.setDescription("How big can it get?")
			.addField("Tower", `The tower currently has ${coins} coins!`)
			.addField("Your Coins", `You have added ${yours} coins to the tower`)
			.addField("Best Coinstackers", coinStackers)
			.setColor("#5500ff")
			.setThumbnail("https://imgur.com/ClVbaOe.png");

		send(embed);
	}
};