const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const itemlist = require(`${__dirname}/../../../tools/constants`).itemlist;
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "trash",
	description: "View the trash can in your server!",
	argument: "None",
	perms: "Embed Links",
	tips: "If trash is disabled, this won't work.",
	aliases: ["trashcan", "can", "rubbish"],
	execute: async function(message, args, prefix, client, [firebase]) {

		await checkGuild(firebase, message.guild.id);

		let guildata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		let guildData = guildata.data();
		if (guildData.enabled.trash == false) return;

		let trash = guildData.trash;
		if (!trash) {
			trash = "Nothing's here ;-;";
		}

		else {
			let newTrash = [];
			for (let item of trash) {
				let itemobj;
				for (let i of itemlist) {
					if (i.name == item) itemobj = i;
				}
				newTrash.push(itemobj.prof);
			}
			trash = newTrash;
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(message.guild.name + "'s Trash:")
			.setDescription(trash)
			.setFooter("Use c!take <item> to take an item out!")
			.setColor("#ffffff");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};