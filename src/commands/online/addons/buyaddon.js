const check = require("../../../tools/check");
const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
module.exports = {
	name: "buyaddon",
	description: "Buy an addon from the worldwide Addon Shop!",
	argument: "The addon you want to buy",
	perms: "",
	tips: "Online and custom addons have to be enabled to use this",
	aliases: ["purchaseaddon"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0]) return send("Phrase the command like this: `c!buyaddon <addon name>`");

		let name = args[0];
		if (name == "none") return send("That's an invalid addon name!");

		let array = await checkOnline(firestore, msg.author.id, userData);
		userData = array[1];
		let online = array[0];

		if (online == false) return;

		let addondata = await firestore.doc(`/online/addons`).get();
		let addonData = addondata.data();
		let addons = addonData.addons;

		if (!addons) return send("That's an invalid addon name!");

		let exists = false;
		for (let addon of addons) {
			if (addon.name.toLowerCase() == name) {
				exists = addon;
			}
		}

		if (exists == false) return send("That's an invalid addon name!");

		if (exists.authorId == msg.author.id) return send("You made that addon! You can't buy it!");

		let od = userData.online.addonInv;

		if (od.first.name.toLowerCase() != "none" && od.second.name.toLowerCase() != "none" && od.third.name.toLowerCase() != "none") return send("You don't have any more space for addons! To delete one, do `c!deleteaddon`!");

		if (cd.first.name.toLowerCase() == name || cd.second.name.toLowerCase() == name || cd.third.name.toLowerCase() == name || od.first.name.toLowerCase() == name || od.second.name.toLowerCase() == name || od.third.name.toLowerCase() == name) return send("You already have an addon with that name!");

		if (exists.cost == userData.currencies.cents) return send("You don't have enough cents to buy that addon!");

		let cost = exists.cost;
		let yourBal = userData.currencies.cents;
		yourBal = Number(yourBal) - Number(cost);
		userData.currencies.cents = yourBal;
		let otherId = `${exists.authorId}`;
		await check(firestore, otherId);
		let authordata = await firestore.doc(`/users/${otherId}`).get();
		let authorData = authordata.data();
		let authorBal = authorData.currencies.cents;
		authorBal = Number(authorBal) + Number(cost);
		authorData.currencies.cents = authorBal;
		let mail = authorBal.newMail;
		if (mail == undefined) mail = [];
		mail.push(`Someone bought your addon **${name}** and you got **${cost}** cents!`);
		authorData.newMail = mail;
		await firestore.doc(`/users/${otherId}`).set(authorData);

		if (od.first.name.toLowerCase() == "none") od.first = exists;
		else if (od.second.name.toLowerCase() == "none") od.second = exists;
		else od.third = exists;

		userData.online.addonInv = od;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);

		send(`You bought the addon **${name}** for **${cost}** cents!`);
	}
};