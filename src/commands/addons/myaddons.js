const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "myaddons",
	description: "Get a list of your custom addons!",
	argument: "None",
	perms: "Embed Links",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["customaddons"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;
		let userData = data.data();
		let cd = userData.addons.customaddons;
		let embed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username}'s Custom Addons:`)
			.setColor('ORANGE');
		let noAddons = true;
		if (cd.first.name.toLowerCase() != "none") {
			noAddons = false;
			let published = cd.first.published;
			if (published == true) published = "Yes";
			else published = "No";
			let responses = cd.first.responses;
			if (responses) responses = cd.first.responses.length;
			else responses = 0;
			embed.addField(cd.first.name, `Description: ${cd.first.description}\nResponses: ${responses}\nPublished: ${published}`);
		}
		if (cd.second.name.toLowerCase() != "none") {
			noAddons = false;
			let published = cd.second.published;
			if (published == true) published = "Yes";
			else published = "No";
			let responses = cd.second.responses;
			if (responses) responses = cd.second.responses.length;
			else responses = 0;
			embed.addField(cd.second.name, `Description: ${cd.second.description}\nResponses: ${responses}\nPublished: ${published}`);
		}
		if (cd.third.name.toLowerCase() != "none") {
			noAddons = false;
			let published = cd.third.published;
			if (published == true) published = "Yes";
			else published = "No";
			let responses = cd.third.responses;
			if (responses) responses = cd.third.responses.length;
			else responses = 0;
			embed.addField(cd.third.name, `Description: ${cd.third.description}\nResponses: ${responses}\nPublished: ${published}`);
		}
		if (noAddons == true) embed.setDescription("You have no addons! Use `c!createaddon` to create one!");
		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};