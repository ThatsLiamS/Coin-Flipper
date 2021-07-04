module.exports = {
	name: "flipboard",
	description: "See the top 10 coin flippers that use the bot!",
	argument: "None",
	perms: "Embed Links",
	aliases: ["fliplb", "superleaderboard", "flb", "fleaderboard", "flipleaderboard"],
	error: true,
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {

		if (!msg.guild.me.hasPermission("SEND_MESSAGES") || !msg.guild.me.hasPermission("EMBED_LINKS")) return send("Sorry, I don't have the right permissions for that command!");
		let message = await msg.channel.send("Getting data...").catch(() => {});
		let usersArray = [];
		let users = await firestore.collection("users");
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
			await message.edit("Sorting data...");
			usersArray = usersArray.sort((a, b) => b.flips - a.flips);
			usersArray = usersArray.slice(0, 10);
			setTimeout(async () => {
				await message.edit("Creating flipboard...");
				let embed = new discord.MessageEmbed()
					.setTitle(`The Top 10 Coin Flippers ever!`)
					.setColor("#e08c38");
				for (let profile of usersArray) {
					if (!profile.id.startsWith("<")) {
						let user = await bot.users.fetch(profile.id);
						let tag;
						if (user) tag = user.tag;
						else tag = "Unknown User";
						embed.addField(tag, `${profile.flips} coins flipped`);
					}
				}
				setTimeout(async () => {
					await message.edit(embed);
				}, 750);
			}, 1000);
		}, 1000);
	}
};