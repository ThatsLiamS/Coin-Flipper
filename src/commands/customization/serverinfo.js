const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const convertToEmote = require(`${__dirname}/../../tools/convertToEmote`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "serverinfo",
	description: "Get some info about the server!",
	argument: "None",
	perms: "Embed Links, Use External Emojis",
	tips: "You can change your server's settings using `c!enable` and `c!disable`",
	aliases: ["server", "guildinfo", "guild", "serversettings", "guildsettings"],
	execute: async function(message, args, prefix, client, [firebase]) {

		await checkGuild(firebase, message.guild.id);
		const guildata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		const guildData = guildata.data();

		let fE = guildData.enabled.flipping;
		if (fE === undefined) fE = true;
		let oE = guildData.enabled.online;
		if (oE === undefined) oE = true;
		let dE = guildData.enabled.trading;
		if (dE === undefined) dE = true;

		fE = await convertToEmote(fE);
		oE = await convertToEmote(oE);
		dE = await convertToEmote(dE);

		const mE = await convertToEmote(guildData.enabled.minigames);
		const pcE = await convertToEmote(guildData.enabled.publiccreate);
		const tE = await convertToEmote(guildData.enabled.trash);
		const kE = await convertToEmote(guildData.enabled.karate);
		const cE = await convertToEmote(guildData.enabled.customaddons);


		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.guild.name}'s Info:`)
			.setDescription(`Prefix: \`${prefix}\``)
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

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};