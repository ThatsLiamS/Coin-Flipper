const admin = require("firebase-admin");

const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const itemlist = require(`${__dirname}/../../../tools/constants`).itemlist;
const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "throw",
	description: "Throw an item away in the trash!",
	argument: "The item you want to throw away",
	perms: "",
	tips: "If trash is disabled, this won't work.",
	aliases: ["throwitem"],
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
			if (i.aliases) {
				if (i.aliases.includes(itemName)) item = i;
			}
		}
		if (!item) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid item!" });

		let objItem = item.id;
		if (userData["inv"][objItem] < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that item!" });

		let trash = guildData.trash;
		if (trash) {
			if (trash.includes(item)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That item is in the trash!" });
		}

		let items = userData["inv"][objItem];
		items = Number(items) - Number(1);
		userData["inv"][objItem] = items;
		userData = await achievementAdd(userData, "throwItAway");

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		await firebase.doc(`/guilds/${message.guild.id}`).update({ "trash": admin.firestore.FieldValue.arrayUnion(item.name) });

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You threw away your ${item.prof}! Use \`c!take\` if you want to get it back!` });

	}
};