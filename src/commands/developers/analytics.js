module.exports = {
	name: "analytics",
	aliases: ["statistics"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		if (data.data().inv.toolbox == false) return send("Sorry, only Coin Flipper developers can use this command!");
		let commandStats = bot.commandsRun.get("commandsRun", "commandStats");
		let commandAnalytics = [];
		for (let property in commandStats) {
			commandAnalytics.push({ label: property, count: commandStats[property] });
		}
		commandAnalytics = commandAnalytics.sort((a, b) => b.count - a.count);
		commandAnalytics = commandAnalytics.slice(0, 10);
		let commandStatistics = [];
		for (let cmd of commandAnalytics) {
			commandStatistics.push(`**${cmd.label.charAt(0).toUpperCase() + cmd.label.slice(1)}:** \`${cmd.count}\``);
		}
		let embed = new discord.MessageEmbed()
			.setTitle("Coin Flipper Analytics")
			.setDescription("The most popular commands in Coin Flipper")
			.addField("Analytics", commandStatistics)
			.setColor('ORANGE');
		send(embed);
	}
};