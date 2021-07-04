module.exports = {
	name: "leaderboard",
	description: "Look at the leaderboard and view the top 10 users in your server!",
	argument: "None",
	perms: "Embed Links",
	aliases: ["lb", "lbd", "ldb", "richest"],
	error: true,
	execute: async function(firestore, args, command, msg, discord, data, send) {

		if (!msg.guild.me.hasPermission("SEND_MESSAGES") || !msg.guild.me.hasPermission("EMBED_LINKS")) return send("Sorry, I don't have the right permissions for that command!");
		let message = await msg.channel.send("Getting data...").catch(() => {});
		let usersArray = [];
		let users = await firestore.collection("users");
		await users.get().then(async (querySnapshot) => {
			await querySnapshot.forEach(async (doc) => {
				let member;
				try {
					member = await msg.guild.members.fetch(doc.id);
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
			await message.edit("Sorting data...");
			usersArray = usersArray.sort((a, b) => b.cents - a.cents);
			setTimeout(async () => {
				await message.edit("Creating leaderboard...");
				let embed = new discord.MessageEmbed()
					.setTitle(`The Top 10 Users in ${msg.guild.name}!`)
					.setDescription("Note: this is a combination of both cents and register")
					.setColor("GREEN");
				for (let profile of usersArray) {
					let user = await msg.guild.members.fetch(profile.id);
					let tag;
					if (user) tag = user.user.tag;
					else tag = "Unknown User";
					embed.addField(tag, `${profile.cents} total cents`);
				}
				setTimeout(async () => {
					await message.edit(embed);
				}, 750);
			}, 1000);
		}, 1000);

	}
};