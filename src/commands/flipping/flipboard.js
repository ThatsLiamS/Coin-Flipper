const Discord = require('discord.js');

module.exports = {
	name: "flipboard",
	description: "See the top 10 coin flippers that use the bot!",
	argument: "None",
	perms: "Embed Links",
	aliases: ["fliplb", "superleaderboard", "flb", "fleaderboard", "flipleaderboard"],
	error: true,
	execute: async function(message, args, prefix, client, [firebase]) {

		let error = false;
		let msg = await message.channel.send("Getting data...").catch(() => { error = true; });
		if(error == true) { return; }

		let usersArray = [];
		let users = await firebase.collection("users");

		await users.get().then((querySnapshot) => {
			querySnapshot.forEach(async (doc) => {
				try {

					if (!doc.data().stats) doc.data().stats = { flipped: 0 };
					await usersArray.push({
						id: doc.id,
						flips: doc.data().stats.flipped
					});
				}
				catch {

					await usersArray.push({
						id: doc.id,
						flips: 0
					});
				}
			});
		});

		setTimeout(async () => {

			await msg.edit("Sorting data...");

			usersArray = usersArray.sort((a, b) => b.flips - a.flips);
			usersArray = usersArray.slice(0, 10);

			setTimeout(async () => {

				await msg.edit("Creating flipboard...");
				const embed = new Discord.MessageEmbed()
					.setTitle(`The Top 10 Coin Flippers ever!`)
					.setColor("#e08c38");

				for (const profile of usersArray) {
					if (!profile.id.startsWith("<")) {
						let user = await client.users.fetch(profile.id);
						let tag;
						if (user) tag = user.tag;
						else tag = "Unknown User";
						embed.addField(tag, `${profile.flips} coins flipped`);
					}
				}

				setTimeout(async () => {

					await msg.edit(embed);

				}, 750);

			}, 1000);

		}, 1000);

	}
};