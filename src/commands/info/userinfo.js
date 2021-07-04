const checkOnline = require("../../tools/checkOnline");
const convertToEmote = require("../../tools/convertToEmote");
const check = require("../../tools/check");
module.exports = {
		name: "userinfo",
    description: "Get your user stats!",
    argument: "Optional: a user mention",
    perms: "Embed Links, Use External Emojis",
    tips: "",
    aliases: ["myinfo", "settings", "stats", "stat"],
    execute: async function(firestore, args, command, msg, discord, data, send) {
      let user = msg.mentions.users.first();
			if (!user) user = msg.author;
			if (user.bot) return send("Bots dont even use the bot smh");
			let userData;
			if (user.id != msg.author.id) {
				await check(firestore, user.id);
				let Data = await firestore.doc(`/users/${user.id}`).get();
				userData = Data.data();
			}
			else userData = data.data();
      let evil = userData.evil;
      let array = await checkOnline(firestore, user.id, userData);
      userData = array[1];
      let online = array[0];
      let compact = userData.compact;
      if (evil == true) evil = await convertToEmote(true);
      else evil = await convertToEmote(false);
      if (compact == true) compact = await convertToEmote(true);
      else compact = await convertToEmote(false);
      if (online == true) online = await convertToEmote(true);
      else online = await convertToEmote(false);
			if (userData.stats.tradingSessionsCompleted === undefined) userData.stats.tradingSessionsCompleted = 0;
			let donator = userData.donator;
			if (donator == 0) donator = "None";
			else if (donator == 1) donator = "Gold";
			else donator = "Platinum";
      let embed = new discord.MessageEmbed()
      .setTitle(`${user.username}'s Info:`)
      .addField("Settings", `Evil mode:\n${evil}\nCompact mode:\n${compact}\nOnline mode:\n${online}`)
      .addField("Stats", `Coins flipped: \`${userData.stats.flipped}\`\nMinigames won: \`${userData.stats.minigames_won}\`\nTimes worked: \`${userData.stats.timesWorked}\`\nKarate battles won: \`${userData.stats.timesWon}\`\nTrading sessions completed: \`${userData.stats.tradingSessionsCompleted}\``)
			.addField(`Donator status:`, donator)
      .setColor("#cd7f32");
      send(embed);
    }
}