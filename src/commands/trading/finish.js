const checkTrading = require("../../tools/checkTrading");
const convertToEmote = require("../../tools/convertToEmote");
const achievementAdd = require("../../tools/achievementAdd");
const gotItem = require("../../tools/gotItem");

module.exports = {
	name: "finish",
	description: "Accept the trades shown (or unaccept them)!",
	argument: "None",
	perms: "",
	tips: "If the other user adds or removes any items/cents, you will automatically unaccept",
	aliases: ["accept"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		let userData = data.data();
		userData = await checkTrading(firestore, msg.author.id, userData);
		if (userData.trading.session === null) return send("You're not in a trading session!");
		if (msg.guild) return send("Do this in a DM!");

		if (userData.trading.session.loading) return send("The trades are final! You can't unaccept!");

		let yep;

		if (userData.trading.session.finished) yep = false;
		else yep = true;

		let other = userData.trading.session.other;
		let otherdata = await firestore.doc(`/users/${other}`).get();
		let otherData = otherdata.data();
		let otherUser = bot.users.cache.get(other);
		let dmChannel = otherUser.dmChannel;

		let message1 = msg.channel.messages.cache.get(userData.trading.session.message.toString());
		let message2 = dmChannel.messages.cache.get(otherData.trading.session.message);

		userData.trading.session.finished = yep;

		let yourDoneY = convertToEmote(userData.trading.session.finished);
		let theirDoneY = convertToEmote(otherData.trading.session.finished);

		let yourItemsY = userData.trading.session.yi;
		let yourTradesY = userData.trading.session.yt;
		let theirTradesY = userData.trading.session.tt;
		let yourItemsO = otherData.trading.session.yi;
		let yourTradesO = otherData.trading.session.yt;
		let theirTradesO = otherData.trading.session.tt;

		if (yourItemsY.length === 0) yourItemsY = "none";
		if (yourTradesY.length === 0) yourTradesY = "none";
		if (theirTradesY.length === 0) theirTradesY = "none";
		if (yourItemsO.length === 0) yourItemsO = "none";
		if (yourTradesO.length === 0) yourTradesO = "none";
		if (theirTradesO.length === 0) theirTradesO = "none";

		let e1 = new discord.MessageEmbed()
			.setTitle("Trading Menu")
			.setDescription("Use `c!addtrade` to add items to your trades, and `c!removetrade` to remove them!\nWhen you're done, use `c!finish` to accept the trades!")
			.setColor("#33dce8")
			.addFields(
				{ name: "Your Items", value: yourItemsY, inline: true },
				{ name: "Your Trades", value: yourTradesY, inline: true },
				{ name: "Their Trades", value: theirTradesY, inline: true }
			)
			.addField("Done?", `You: ${yourDoneY} Them: ${theirDoneY}`)
			.setFooter("Use c!cancel to cancel the session");

		if (yourTradesO.length === 0) yourTradesO = "none";
		let e2 = new discord.MessageEmbed()
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

		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/users/${other}`).set(otherData);

		if (yourDoneY.includes("true") && theirDoneY.includes("true")) {
			userData.trading.session.loading = true;
			otherData.trading.session.loading = true;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			await firestore.doc(`/users/${other}`).set(otherData);

			message1.channel.send("The trading session is ending!");
			message2.channel.send("The trading session is ending!");

			let yourTrades = userData.trading.session.yto;
			let theirTrades = userData.trading.session.tto;

			for (let property in yourTrades) {
				let item = yourTrades[property];
				let yAmt = userData.inv[item.item.id];
				let tAmt = otherData.inv[item.item.id];
				userData.inv[item.item.id] = yAmt - item.amt;
				otherData.inv[item.item.id] = tAmt + item.amt;
			}
			for (let property in theirTrades) {
				let item = theirTrades[property];
				let yAmt = userData.inv[item.item.id];
				let tAmt = otherData.inv[item.item.id];
				userData.inv[item.item.id] = yAmt + item.amt;
				otherData.inv[item.item.id] = tAmt - item.amt;
			}
			let yCents = userData.trading.session.yc;
			let tCents = userData.trading.session.tc;
			userData.currencies.cents = Number(userData.currencies.cents) - Number(yCents);
			otherData.currencies.cents = Number(otherData.currencies.cents) + Number(yCents);
			userData.currencies.cents = Number(userData.currencies.cents) + Number(tCents);
			otherData.currencies.cents = Number(otherData.currencies.cents) - Number(tCents);

			userData.trading.session = null;
			otherData.trading.session = null;

			let yC = userData.stats.tradingSessionsCompleted;
			let tC = otherData.stats.tradingSessionsCompleted;
			if (yC === undefined) yC = 0;
			if (tC === undefined) tC = 0;
			userData.stats.tradingSessionsCompleted = yC + 1;
			otherData.stats.tradingSessionsCompleted = tC + 1;

			userData = await achievementAdd(userData, "businessAsUsual");
			otherData = await achievementAdd(otherData, "businessAsUsual");

			userData = await gotItem(userData);
			otherData = await gotItem(otherData);

			setTimeout(async () => {
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
				await firestore.doc(`/users/${other}`).set(otherData);
				message1.channel.send("The trading session is complete!");
				message2.channel.send("The trading session is complete!");
			}, 5000);
		}
		else {
			msg.channel.send("You finished your trades! You must wait until the other user finishes...\nNote: if you or the other user adds or removes any items you will be unaccepted again").then(async message => {
				setTimeout(async () => {
					await message.delete();
				}, 10000);
			});
		}
	}
};