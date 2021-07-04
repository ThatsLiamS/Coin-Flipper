const checkGuild = require("../../tools/checkGuild");
const convertToEmote = require("../../tools/convertToEmote");
module.exports = {
	name: "serverinfo",
	description: "Get some info about the server!",
	argument: "None",
	perms: "Embed Links, Use External Emojis",
	tips: "You can change your server's settings using `c!enable` and `c!disable`",
	aliases: ["server", "guildinfo", "guild", "serversettings", "guildsettings"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		await checkGuild(firestore, msg.guild.id);
		let guildata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		let guildData = guildata.data();
		let fE = guildData.enabled.flipping;
		if (fE === undefined) fE = true;
		let oE = guildData.enabled.online;
		if (oE === undefined) oE = true;
		let dE = guildData.enabled.trading;
		if (dE === undefined) dE = true;
		fE = await convertToEmote(fE);
		oE = await convertToEmote(oE);
		dE = await convertToEmote(dE);
		let mE = await convertToEmote(guildData.enabled.minigames);
		let pcE = await convertToEmote(guildData.enabled.publiccreate);
		let tE = await convertToEmote(guildData.enabled.trash);
		let kE = await convertToEmote(guildData.enabled.karate);
		let cE = await convertToEmote(guildData.enabled.customaddons);
		let gprefix = bot.prefixes.get(msg.guild.id, "prefix");
		if (!gprefix) gprefix = "t!";
		let embed = new discord.MessageEmbed()
			.setTitle(`${msg.guild.name}'s Info:`)
			.setDescription(`Prefix: \`${gprefix}\``)
			.addField("Flipping", fE)
			.addField("Minigames", mE)
			.addField("Public Minigame Creation", pcE)
			.addField("Trash", tE)
			.addField("Karate", kE)
			.addField("Custom Addons", cE)
			.addField("Online", oE)
			.addField("Trading", dE)
			.setColor("#cd7f32")
			.setFooter("Mods and admins! Use c!enable and c!disable to change these settings!");
		send(embed);
	}
};