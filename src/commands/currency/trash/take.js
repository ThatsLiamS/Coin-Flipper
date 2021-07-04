const checkGuild = require("../../../tools/checkGuild");
const itemlist = require("../../../tools/constants").itemlist;
const gotItem = require("../../../tools/gotItem");
const admin = require("firebase-admin");
module.exports = {
	name: "take",
	description: "Take an item from the trash!",
	argument: "The item you want to take",
	perms: "",
	tips: "If trash is disabled, this won't work.",
	aliases: ["takeitem"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guildata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		let guildData = guildata.data();
		if (guildData.enabled.trash == false) return;
		let userData = data.data();
		let itemName = args.slice(0).join(" ");
		let item;
		for (let i of itemlist) {
			if (i.name == itemName) item = i;
			if (i.aliases.includes(itemName)) item = i;
		}
		if (!item) return send("That isn't a valid item!");
		let objItem = item.id;
		if (!guildData.trash) return send("That item isn't in the trash!");
		if (!guildData.trash.includes(item.name)) return send("That item isn't in the trash!");
		let items = userData["inv"][objItem];
		items = Number(items) + Number(1);
		userData["inv"][objItem] = items;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		if (guildData.trash.length == 1) {
			await firestore.doc(`/guilds/${msg.guild.id}`).update({ "trash": admin.firestore.FieldValue.delete() });
		}
		else {
			await firestore.doc(`/guilds/${msg.guild.id}`).update({ "trash": admin.firestore.FieldValue.arrayRemove(item.name) });
		}
		userData = await gotItem(userData);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You took a ${item.prof} out of the trash!`);
	}
};