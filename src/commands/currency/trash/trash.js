const checkGuild = require("../../../tools/checkGuild");
const itemlist = require("../../../tools/constants").itemlist;
module.exports = {
	name: "trash",
	description: "View the trash can in your server!",
	argument: "None",
	perms: "Embed Links",
	tips: "If trash is disabled, this won't work.",
	aliases: ["trashcan", "can", "rubbish"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guildata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
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
		let embed = new discord.MessageEmbed()
			.setTitle(msg.guild.name + "'s Trash:")
			.setDescription(trash)
			.setFooter("Use c!take <item> to take an item out!")
			.setColor("#ffffff");
		send(embed);
	}
};