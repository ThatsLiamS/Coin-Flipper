const admin = require("firebase-admin");

const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const itemlist = require(`${__dirname}/../../../tools/constants`).itemlist;
const gotItem = require(`${__dirname}/../../../tools/gotItem`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "take",
	description: "Take an item from the trash!",
	argument: "The item you want to take",
	perms: "",
	tips: "If trash is disabled, this won't work.",
	aliases: ["takeitem"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);

		let guildata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		let guildData = guildata.data();
		if (guildData.enabled.trash == false) return;

		let userData = data.data();
		let itemName = args.slice(0).join(" ");
		let item;

		for (let i of itemlist) {
			if (i.name == itemName) item = i;
			if (i.aliases.includes(itemName)) item = i;
		}
		if (!item) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That isn't a valid item!" });

		let objItem = item.id;
		if (!guildData.trash) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That item isn't in the trash!" });
		if (!guildData.trash.includes(item.name)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That item isn't in the trash!" });

		let items = userData["inv"][objItem];
		items = Number(items) + Number(1);
		userData["inv"][objItem] = items;

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		if (guildData.trash.length == 1) {
			await firebase.doc(`/guilds/${message.guild.id}`).update({ "trash": admin.firestore.FieldValue.delete() });
		}
		else {
			await firebase.doc(`/guilds/${message.guild.id}`).update({ "trash": admin.firestore.FieldValue.arrayRemove(item.name) });
		}

		userData = await gotItem(userData);
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You took a ${item.prof} out of the trash!` });

	}
};