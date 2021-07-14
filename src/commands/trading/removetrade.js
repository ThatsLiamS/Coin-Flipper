const Discord = require('discord.js');

const checkTrading = require(`${__dirname}/../../tools/checkTrading`);
const convertToEmote = require(`${__dirname}/../../tools/convertToEmote`);
const itemList = require(`${__dirname}/../../tools/constants`).itemlist;
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "removetrade",
	description: "Remove an item from your trades!",
	argument: "The item you want to remove",
	perms: "",
	tips: "",
	aliases: ["deletetrade"],
	execute: async function(msg, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		userData = await checkTrading(firebase, msg.author.id, userData);
		if (userData.trading.session === null) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "You're not in a trading session!" });
		if (msg.guild) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "Do this in a DM!" });

		if (userData.trading.session.loading) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "The trades are final! You can't remove any more items!" });

		let itemName = args[0];
		if (!itemName) {
			msg.channel.send("You have to include the item you want to remove! (or `cents` to remove cents)").then(async message => {
				setTimeout(async () => {
					await message.delete();
				}, 1000);
			});
			return;
		}

		if (itemName == "cents") {

			let centAmt = args[1];
			if (!centAmt || centAmt < 1 || isNaN(centAmt) || centAmt % 1 != 0) {
				msg.channel.send("You have to include a valid number of cents!").then(async message => {
					setTimeout(async () => {
						await message.delete();
					}, 1000);
				});
				return;
			}
			if (userData.trading.session.yc < centAmt) {
				msg.channel.send("You don't have that many cents!").then(async message => {
					setTimeout(async () => {
						await message.delete();
					}, 1000);
				});
				return;
			}
			centAmt = Number(centAmt);
			userData.trading.session.yic = userData.trading.session.yic + centAmt;
			let other = userData.trading.session.other;
			let otherdata = await firebase.doc(`/users/${other}`).get();
			let otherData = otherdata.data();
			let otherUser = client.users.cache.get(other);
			let dmChannel = otherUser.dmChannel;
			userData.trading.session.yc = userData.trading.session.yc - centAmt;
			otherData.trading.session.tc = otherData.trading.session.tc - centAmt;
			let yourItems = userData.trading.session.yi;
			let yourTrades = userData.trading.session.yt;
			let ind1 = yourTrades.indexOf(yourTrades.find(ite => ite.startsWith("🪙")));
			if (userData.trading.session.yc == 0) {
				yourTrades.splice(ind1, 1);
			}
			else {
				yourTrades[ind1] = `🪙 Cents: ${userData.trading.session.yc}`;
			}
			let cent = yourItems.find(ite => ite.startsWith("🪙"));
			if (!cent) {
				yourItems.push(`🪙 Cents: ${userData.trading.session.yic}`);
			}
			else {
				let ind2 = yourItems.indexOf(cent);
				yourItems[ind2] = `🪙 Cents: ${userData.trading.session.yic}`;
			}
			userData.trading.session.yi = yourItems;
			userData.trading.session.yt = yourTrades;
			otherData.trading.session.tt = yourTrades;

			let theirTradesA = userData.trading.session.tt;

			let yourItemsO = otherData.trading.session.yi;
			let yourTradesO = otherData.trading.session.yt;
			let theirTradesO = otherData.trading.session.tt;

			otherData.trading.session.tt = theirTradesA;

			let message1 = msg.channel.messages.cache.get(userData.trading.session.message.toString());
			let message2 = dmChannel.messages.cache.get(otherData.trading.session.message);

			if (yourTrades.length === 0) yourTrades = "none";
			if (theirTradesA.length === 0) theirTradesA = "none";
			if (yourTradesO.length === 0) yourTradesO = "none";
			if (theirTradesO.length === 0) theirTradesO = "none";

			let yourDoneY = convertToEmote(false);
			let theirDoneY = convertToEmote(false);
			userData.trading.session.finished = false;
			otherData.trading.session.finished = false;

			let e1 = new Discord.MessageEmbed()
				.setTitle("Trading Menu")
				.setDescription("Use `c!addtrade` to add items to your trades, and `c!removetrade` to remove them!\nWhen you're done, use `c!finish` to accept the trades!")
				.setColor("#33dce8")
				.addFields(
					{ name: "Your Items", value: yourItems, inline: true },
					{ name: "Your Trades", value: yourTrades, inline: true },
					{ name: "Their Trades", value: theirTradesA, inline: true }
				)
				.addField("Done?", `You: ${yourDoneY} Them: ${theirDoneY}`)
				.setFooter("Use c!cancel to cancel the session");

			if (yourTradesO.length === 0) yourTradesO = "none";
			let e2 = new Discord.MessageEmbed()
				.setTitle("Trading Menu")
				.setDescription("Use `c!addtrade` to add items to your trades, and `c!removetrade` to remove them!\nWhen you're done, use `c!finish` to accept the trades!")
				.setColor("#33dce8")
				.addFields(
					{ name: "Your Items", value: yourItemsO, inline: true },
					{ name: "Your Trades", value: yourTradesO, inline: true },
					{ name: "Their Trades", value: theirTradesO, inline: true }
				)
				.addField("Done?", `You: ${theirDoneY} Them: ${yourDoneY}`)
				.setFooter("Use c!cancel to cancel the session");

			await message1.edit(e1);
			await message2.edit(e2);

			msg.author.send("Item added!").then(async message => {
				setTimeout(async () => {
					await message.delete();
				}, 1000);
			});

			await firebase.doc(`/users/${msg.author.id}`).set(userData);
			await firebase.doc(`/users/${other}`).set(otherData);

		}
		else {

			let item;
			function findItem() {
				for (let i of itemList) {
					if (i.name == itemName) item = i;
					if (i.aliases.includes(itemName)) item = i;
				}
			}
			let done = false;
			for (let i = 0; i < 5; i++) {
				if (done == false) {
					itemName = args.slice(0, i + 1).join(" ");
					findItem(itemName);
					if (item !== undefined) done = true;
				}
			}
			if (!item) {
				msg.channel.send("That's not a valid item!").then(async message => {
					setTimeout(async () => {
						await message.delete();
					}, 1000);
				});
				return;
			}

			let amt = Number(args[1]);
			if (isNaN(amt) || amt === undefined) amt = Number(args[2]);
			if (isNaN(amt) || amt === undefined) amt = Number(args[3]);
			if (isNaN(amt) || amt === undefined) amt = Number(args[4]);
			if (isNaN(amt) || amt === undefined) amt = Number(args[5]);
			if (isNaN(amt) || amt === undefined) amt = 1;

			let yourItems = userData.trading.session.yio;
			let yourTrades = userData.trading.session.yto;
			let yourItemsA = userData.trading.session.yi;
			let yourTradesA = userData.trading.session.yt;

			if (yourItemsA == "none") yourItemsA = [];
			if (yourTradesA == "none") yourTradesA = [];

			let thatItem = yourTrades[item.id];
			if (!thatItem) {
				yourTrades[item.id] = {
					item: item,
					amt: 0
				};
			}
			if (yourItems[item.id] === undefined) {
				msg.channel.send("You don't have that item!").then(async message => {
					setTimeout(async () => {
						await message.delete();
					}, 1000);
				});
				return;
			}
			if (amt > yourTrades[item.id].amt) {
				msg.channel.send("You don't have that many of that item!").then(async message => {
					setTimeout(async () => {
						await message.delete();
					}, 1000);
				});
				return;
			}
			if (yourItems[item.id].amt === undefined) {
				yourItems[item.id] = {
					item: itemList.find(ite => ite.id == item.id),
					amt: 0
				};
			}
			yourItems[item.id].amt = yourItems[item.id].amt + amt;
			if (yourTrades[item.id] === undefined) {
				yourTrades[item.id] = {
					item: itemList.find(ite => ite.id == item.id),
					amt: 0
				};
			}
			yourTrades[item.id].amt = yourTrades[item.id].amt - amt;
			if (yourTrades[item.id].amt == 0) {
				yourTradesA.splice(yourTradesA.indexOf(yourTradesA.find(ite => ite.startsWith(item.prof))), 1);
			}
			else {
				let ind = yourTradesA.indexOf(yourTradesA.find(ite => ite.startsWith(item.prof)));
				yourTradesA[ind] = `${item.prof}: ${yourTrades[item.id].amt}`;
			}

			let itemA = yourItemsA.find(ite => ite.startsWith(item.prof));
			if (!itemA) {
				yourItemsA.push(`${item.prof}: ${yourItems[item.id].amt}`);
			}
			else {
				let ind = yourItemsA.indexOf(itemA);
				yourItemsA[ind] = `${item.prof}: ${yourItems[item.id].amt}`;
			}

			let other = userData.trading.session.other;
			let otherdata = await firebase.doc(`/users/${other}`).get();
			let otherData = otherdata.data();
			let otherUser = client.users.cache.get(other);
			let dmChannel = otherUser.dmChannel;

			let theirTradesO = otherData.trading.session.tt;
			theirTradesO = yourTradesA;
			let theirTradesA = userData.trading.session.tt;

			let yourItemsO = otherData.trading.session.yi;
			let yourTradesO = otherData.trading.session.yt;

			userData.trading.session.yi = yourItemsA;
			userData.trading.session.yio = yourItems;
			userData.trading.session.yt = yourTradesA;
			userData.trading.session.yto = yourTrades;

			otherData.trading.session.tt = yourTradesA;
			otherData.trading.session.tto = yourTrades;

			let message1 = msg.channel.messages.cache.get(userData.trading.session.message.toString());
			let message2 = dmChannel.messages.cache.get(otherData.trading.session.message);

			if (yourTradesA.length === 0) yourTradesA = "none";
			if (theirTradesA.length === 0) theirTradesA = "none";
			if (yourTradesO.length === 0) yourTradesO = "none";
			if (theirTradesO.length === 0) theirTradesO = "none";

			let yourDoneY = convertToEmote(false);
			let theirDoneY = convertToEmote(false);
			userData.trading.session.finished = false;
			otherData.trading.session.finished = false;

			const e1 = new Discord.MessageEmbed()
				.setTitle("Trading Menu")
				.setDescription("Use `c!addtrade` to add items to your trades, and `c!removetrade` to remove them!\nWhen you're done, use `c!finish` to accept the trades!")
				.setColor("#33dce8")
				.addFields(
					{ name: "Your Items", value: yourItemsA, inline: true },
					{ name: "Your Trades", value: yourTradesA, inline: true },
					{ name: "Their Trades", value: theirTradesA, inline: true }
				)
				.addField("Done?", `You: ${yourDoneY} Them: ${theirDoneY}`)
				.setFooter("Use c!cancel to cancel the session");

			if (yourTradesO.length === 0) yourTradesO = "none";
			const e2 = new Discord.MessageEmbed()
				.setTitle("Trading Menu")
				.setDescription("Use `c!addtrade` to add items to your trades, and `c!removetrade` to remove them!\nWhen you're done, use `c!finish` to accept the trades!")
				.setColor("#33dce8")
				.addFields(
					{ name: "Your Items", value: yourItemsO, inline: true },
					{ name: "Your Trades", value: yourTradesO, inline: true },
					{ name: "Their Trades", value: theirTradesO, inline: true }
				)
				.addField("Done?", `You: ${theirDoneY} Them: ${yourDoneY}`)
				.setFooter("Use c!cancel to cancel the session");

			await message1.edit(e1);
			await message2.edit(e2);

			msg.author.send("Item removed!").then(async message => {
				setTimeout(async () => {
					await message.delete();
				}, 1000);
			});

			await firebase.doc(`/users/${msg.author.id}`).set(userData);
			await firebase.doc(`/users/${other}`).set(otherData);
		}
	}
};