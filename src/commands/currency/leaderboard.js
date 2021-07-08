const Discord = require('discord.js');

const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "leaderboard",
	description: "Look at the leaderboard and view the top 10 users in your server!",
	argument: "None",
	perms: "Embed Links",
	aliases: ["lb", "lbd", "ldb", "richest"],
	error: true,
	execute: async function(message, args, prefix, client, [firebase]) {

		if (!message.guild.me.hasPermission("SEND_MESSAGES") || !message.guild.me.hasPermission("EMBED_LINKS")) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, I don't have the right permissions for that command!" });
		let msg = await message.channel.send("Getting data...").catch(() => {});

		let usersArray = [];
		let users = await firebase.collection("users");
		await users.get().then(async (querySnapshot) => {
			await querySnapshot.forEach(async (doc) => {
				let member;
				try {
					member = await message.guild.members.fetch(doc.id);
				}
				catch {
					member = "not found";
				}
				if (member != "not found" && member.user.bot == false) {
					await usersArray.push({
						id: doc.id,
						cents: doc.data().currencies.cents + doc.data().currencies.register
					});
				}
			});
		});
		setTimeout(async () => {
			await msg.edit("Sorting data...");
			usersArray = usersArray.sort((a, b) => b.cents - a.cents);

			setTimeout(async () => {
				await msg.edit("Creating leaderboard...");

				const embed = new Discord.MessageEmbed()
					.setTitle(`The Top 10 Users in ${message.guild.name}!`)
					.setDescription("Note: this is a combination of both cents and register")
					.setColor("GREEN");

				for (const profile of usersArray) {
					let user = await message.guild.members.fetch(profile.id);
					let tag;

					if (user) tag = user.user.tag;
					else tag = "Unknown User";

					embed.addField(tag, `${profile.cents} total cents`);
				}

				setTimeout(async () => {
					await msg.edit(embed);
				}, 750);
			}, 1000);
		}, 1000);

	}
};