const Discord = require('discord.js');

const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "superleaderboard",
	description: "Look at the leaderboard and view the top 10 users... in the entire bot!",
	argument: "None",
	perms: "Embed Links",
	aliases: ["slb", "slbd", "sldb", "superlb", "superlbd", "superldb", "sleaderboard"],
	error: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (!message.guild.me.hasPermission("SEND_MESSAGES") || !message.guild.me.hasPermission("EMBED_LINKS")) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, I don't have the right permissions for that command!" });

		let msg = await message.channel.send("Getting data...").catch(() => {});
		let usersArray = [];
		let users = await firebase.collection("users");

		await users.get().then((querySnapshot) => {
			querySnapshot.forEach(async (doc) => {
				try {
					await usersArray.push({
						id: doc.id,
						cents: doc.data().currencies.cents + data.data().currencies.register
					});
				}
				catch {
					await usersArray.push({
						id: doc.id,
						cents: 0
					});
				}
			});
		});

		setTimeout(async () => {
			await msg.edit("Sorting data...");

			usersArray = usersArray.sort((a, b) => b.cents - a.cents);
			usersArray = usersArray.slice(0, 10);

			setTimeout(async () => {
				await msg.edit("Creating superleaderboard...");

				const embed = new Discord.MessageEmbed()
					.setTitle(`The Top 10 users ever!`)
					.setDescription("Note: this is a combination of both cents and register")
					.setColor("#e08c38");

				for (const profile of usersArray) {
					if (!profile.id.startsWith("<")) {
						let user = await client.users.fetch(profile.id);

						let tag;
						if (user) tag = user.tag;
						else tag = "Unknown User";

						embed.addField(tag, `${profile.cents} total cents`);
					}
				}
				setTimeout(async () => {
					await msg.edit(embed);
				}, 750);

			}, 1000);

		}, 1000);
	}
};