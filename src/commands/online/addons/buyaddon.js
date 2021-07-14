const check = require(`${__dirname}/../../../tools/check`);
const checkGuild = require(`${__dirname}/../../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../../tools/checkOnline`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "buyaddon",
	description: "Buy an addon from the worldwide Addon Shop!",
	argument: "The addon you want to buy",
	perms: "",
	tips: "Online and custom addons have to be enabled to use this",
	aliases: ["purchaseaddon"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!buyaddon <addon name>`" });

		let name = args[0];
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let array = await checkOnline(firebase, message.author.id, userData);
		userData = array[1];
		let online = array[0];

		if (online == false) return;

		let addondata = await firebase.doc(`/online/addons`).get();
		let addonData = addondata.data();
		let addons = addonData.addons;

		if (!addons) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let exists = false;
		for (let addon of addons) {
			if (addon.name.toLowerCase() == name) {
				exists = addon;
			}
		}

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		if (exists.authorId == message.author.id) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You made that addon! You can't buy it!" });

		let od = userData.online.addonInv;

		if (od.first.name.toLowerCase() != "none" && od.second.name.toLowerCase() != "none" && od.third.name.toLowerCase() != "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have any more space for addons! To delete one, do `c!deleteaddon`!" });

		if (cd.first.name.toLowerCase() == name || cd.second.name.toLowerCase() == name || cd.third.name.toLowerCase() == name || od.first.name.toLowerCase() == name || od.second.name.toLowerCase() == name || od.third.name.toLowerCase() == name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have an addon with that name!" });

		if (exists.cost == userData.currencies.cents) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have enough cents to buy that addon!" });

		let cost = exists.cost;
		let yourBal = userData.currencies.cents;
		yourBal = Number(yourBal) - Number(cost);
		userData.currencies.cents = yourBal;
		let otherId = `${exists.authorId}`;

		await check(firebase, otherId);
		let authordata = await firebase.doc(`/users/${otherId}`).get();

		let authorData = authordata.data();
		let authorBal = authorData.currencies.cents;
		authorBal = Number(authorBal) + Number(cost);
		authorData.currencies.cents = authorBal;

		let mail = authorBal.newMail;
		if (mail == undefined) mail = [];
		mail.push(`Someone bought your addon **${name}** and you got **${cost}** cents!`);
		authorData.newMail = mail;
		await firebase.doc(`/users/${otherId}`).set(authorData);

		if (od.first.name.toLowerCase() == "none") od.first = exists;
		else if (od.second.name.toLowerCase() == "none") od.second = exists;
		else od.third = exists;

		userData.online.addonInv = od;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You bought the addon **${name}** for **${cost}** cents!` });

	}
};