module.exports = {
	name: "superleaderboard",
	description: "Look at the leaderboard and view the top 10 users... in the entire bot!",
	argument: "None",
	perms: "Embed Links",
	aliases: ["slb", "slbd", "sldb", "superlb", "superlbd", "superldb", "sleaderboard"],
	error: true,
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {

		if (!msg.guild.me.hasPermission("SEND_MESSAGES") || !msg.guild.me.hasPermission("EMBED_LINKS")) return send("Sorry, I don't have the right permissions for that command!");
		let message = await msg.channel.send("Getting data...").catch(() => {});
		let usersArray = [];
		let users = await firestore.collection("users");
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
			await message.edit("Sorting data...");
			usersArray = usersArray.sort((a, b) => b.cents - a.cents);
			usersArray = usersArray.slice(0, 10);
			setTimeout(async () => {
				await message.edit("Creating superleaderboard...");
				let embed = new discord.MessageEmbed()
					.setTitle(`The Top 10 users ever!`)
					.setDescription("Note: this is a combination of both cents and register")
					.setColor("#e08c38");
				for (let profile of usersArray) {
					if (!profile.id.startsWith("<")) {
						let user = await bot.users.fetch(profile.id);
						let tag;
						if (user) tag = user.tag;
						else tag = "Unknown User";
						embed.addField(tag, `${profile.cents} total cents`);
					}
				}
				setTimeout(async () => {
					await message.edit(embed);
				}, 750);
			}, 1000);
		}, 1000);
	}
};