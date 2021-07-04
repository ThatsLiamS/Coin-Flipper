module.exports = {
	name: "botinfo",
	description: "View some info about the bot!",
	argument: "None",
	perms: "Embed Links",
	tips: "",
	aliases: ["info", "botstats"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		let guilds = bot.guilds.cache.size;
		let members = 0;
		bot.guilds.cache.forEach(guild => {
			members += guild.memberCount;
		});
		let mostPopular = { times: 0 };
		let commandStats = bot.commandsRun.get("commandsRun", "commandStats");
		for (let property in commandStats) {
			if (commandStats[property] > mostPopular.times) {
				mostPopular = {
					name: property,
					times: commandStats[property]
				};
			}
		}
		let embed = new discord.MessageEmbed()
			.setTitle(`${bot.user.username}'s Info:`)
			.setURL('')
			.addField("Servers", guilds)
			.addField("Users", members)
			.addField("Team", "[SuperPhantomUser](): Developer\n[ThatsLiamS](https://discord.gg/2je9aJynqt): Developer, CFO\n[AsyncBanana](): Web developer")
			.addField("Commands", `Since May 4 2021:\nCommands run: ${bot.commandsRun.get("commandsRun", "commandsRun")}\nMost popular command: ${mostPopular.name}`)
			.setColor("#cd7f32")
			.setFooter("Use c!serverinfo to view server info!");
		send(embed);
	}
};