const checkGuild = require("../../../tools/checkGuild");
const itemlist = require("../../../tools/constants").itemlist;
const achievementAdd = require("../../../tools/achievementAdd");
const admin = require("firebase-admin");
module.exports = {
	name: "throw",
	description: "Throw an item away in the trash!",
	argument: "The item you want to throw away",
	perms: "",
	tips: "If trash is disabled, this won't work.",
	aliases: ["throwitem"],
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
			if (i.aliases) {
				if (i.aliases.includes(itemName)) item = i;
			}
		}
		if (!item) return send("That's not a valid item!");
		let objItem = item.id;
		if (userData["inv"][objItem] < 1) return send("You don't have that item!");
		let trash = guildData.trash;
		if (trash) {
			if (trash.includes(item)) return send("That item is in the trash!");
		}
		let items = userData["inv"][objItem];
		items = Number(items) - Number(1);
		userData["inv"][objItem] = items;
		userData = await achievementAdd(userData, "throwItAway");
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/guilds/${msg.guild.id}`).update({ "trash": 	admin.firestore.FieldValue.arrayUnion(item.name) });
		send(`You threw away your ${item.prof}! Use \`c!take\` if you want to get it back!`);
	}
};