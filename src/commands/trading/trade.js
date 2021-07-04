const check = require("../../tools/check");
const checkGuild = require("../../tools/checkGuild");
const checkTrading = require("../../tools/checkTrading");
const convertToEmote = require("../../tools/convertToEmote");
const itemList = require("../../tools/constants").itemlist;
const alphabet = require("../../tools/constants").normalCharacters;

module.exports = {
	name: "trade",
	description: "Start a trading session with another user!",
	argument: "A user mention of the user you want to trade with",
	perms: "Embed Links",
	tips: "This won't work if trading is disabled",
	aliases: ["session", "starttrade", "starttrading"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guildData = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guildData.data().enabled.trading === false) return;

		let userData = data.data();
		userData = await checkTrading(firestore, msg.author.id, userData);

		if (userData.trading.session !== null) return send("You're already in a trading session! Use `c!cancel` to cancel it!");

		function checkZeros(inv) {
			let empty = true;
			for (let property in inv) {
				if (inv[property] !== 0 && property !== "toolbox") empty = false;
			}
			return empty;
		}

		if (checkZeros(userData.inv) && userData.currencies.cents == 0) return send("Sorry, both users need at least one item or one cent to start a trading session!");

		let other = msg.mentions.users.first();
		if (!other) return send("You need to mention a user to trade with!");
		if (msg.author.id == other.id) return send("Why would you want to trade with yourself?");
		await check(firestore, other.id);
		let otherdata = await firestore.doc(`/users/${other.id}`).get();
		let otherData = otherdata.data();
		otherData = await checkTrading(firestore, other.id, otherData);

		if (otherData.trading.session !== null) return send(`${other} is already in a trading session! Use \`c!cancel\` to cancel!`);

		if (checkZeros(otherData.inv) && otherData.currencies.cents == 0) return send("Sorry, both users need at least one item or one cent to start a trading session!");

		userData.trading.session = 1;
		otherData.trading.session = 1;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		await firestore.doc(`/users/${other.id}`).set(otherData);

		async function reset() {
			userData.trading.session = null;
			otherData.trading.session = null;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			await firestore.doc(`/users/${other.id}`).set(otherData);
		}

		send(`<@${other.id}>, <@${msg.author.id}> has requested to trade with you! Type \`accept\` or \`decline\`!\nNote: make sure that both of your DMs are open`);
		msg.channel.awaitMessages(m => m.author.id == other.id, { time: 30000, max: 1 }).then(async collected => {

			let message = collected.first();
			if (!message) {
				reset();
				return send("They didn't respond!");
			}

			let content = message.content.toLowerCase().trim();
			if (content != "accept" && content != "deny" && content != "decline") {
				reset();
				return send("That wasn't a valid answer! (accept or decline)");
			}

			if (content == "decline" || content == "deny") {
				reset();
				return send("They declined!");
			}

			let yep = true;

			msg.author.send("The trading session will start in a bit!").catch(() => {
				yep = false;
			});
			other.send("The trading session will start in a bit!").catch(() => {
				yep = false;
			});

			if (yep == false) return send("Both users need to have their DMs open for the trading session to start");

			let yourItems = [];
			let yourItemsObj = {};
			for (let property in userData.inv) {
				let itemFound;
				for (let ite of itemList) {
					if (ite.id == property) itemFound = ite;
				}
				if (itemFound) {
					if (userData.inv[property] > 0) {
						yourItems.push(`${itemFound.prof}: ${userData.inv[property]}`);
						yourItemsObj[itemFound.id] = {
							item: itemFound,
							amt: userData.inv[property]
						};
					}
				}
			}

			if (userData.currencies.cents > 0) {
				yourItems.push(`🪙 Cents: ${userData.currencies.cents}`);
			}

			let yourDoneY = convertToEmote(false);
			let theirDoneY = convertToEmote(false);

			let embed1 = new discord.MessageEmbed()
				.setTitle("Trading Menu")
				.setDescription("Use `c!addtrade` to add items to your trades, and `c!removetrade` to remove them!\nWhen you're done, use `c!finish` to accept the trades!")
				.setColor("#33dce8")
				.addFields(
					{ name: "Your Items", value: yourItems, inline: true },
					{ name: "Your Trades", value: "none", inline: true },
					{ name: "Their Trades", value: "none", inline: true }
				)
				.addField("Done?", `You: ${yourDoneY} Them: ${theirDoneY}`)
				.setFooter("Use c!cancel to cancel the session");
			let id1 = alphabet[Math.floor(Math.random() * alphabet.length)];
			let id2 = alphabet[Math.floor(Math.random() * alphabet.length)];
			let id3 = alphabet[Math.floor(Math.random() * alphabet.length)];
			let id4 = alphabet[Math.floor(Math.random() * alphabet.length)];
			let id5 = alphabet[Math.floor(Math.random() * alphabet.length)];
			let id6 = alphabet[Math.floor(Math.random() * alphabet.length)];
			let id = `${id1}${id2}${id3}${id4}${id5}${id6}`;
			userData.trading.session = {
				id: id,
				yi: yourItems,
				yio: yourItemsObj,
				yt: [],
				yto: {},
				tt: [],
				yic: userData.currencies.cents,
				yc: 0,
				tc: 0,
				finished: false,
				loading: false,
				other: other.id
			};

			let theirItems = [];
			let theirItemsObj = {};
			for (let property in otherData.inv) {
				let itemFound;
				for (let ite of itemList) {
					if (ite.id == property) itemFound = ite;
				}
				if (itemFound) {
					if (otherData.inv[property] > 0) {
						theirItems.push(`${itemFound.prof}: ${otherData.inv[property]}`);
						theirItemsObj[itemFound.id] = {
							item: itemFound,
							amt: otherData.inv[property]
						};
					}
				}
			}

			if (otherData.currencies.cents > 0) {
				theirItems.push(`🪙 Cents: ${otherData.currencies.cents}`);
			}

			let embed2 = new discord.MessageEmbed()
				.setTitle("Trading Menu")
				.setDescription("Use `c!addtrade` to add items to your trades, and `c!removetrade` to remove them!\nWhen you're done, use `c!finish` to accept the trades!")
				.setColor("#33dce8")
				.addFields(
					{ name: "Your Items", value: theirItems, inline: true },
					{ name: "Your Trades", value: "none", inline: true },
					{ name: "Their Trades", value: "none", inline: true }
				)
				.addField("Done?", `You: ${theirDoneY} Them: ${yourDoneY}`)
				.setFooter("Use c!cancel to cancel the session");
			otherData.trading.session = {
				id: id,
				yi: theirItems,
				yio: theirItemsObj,
				yt: [],
				yto: {},
				tt: [],
				yic: otherData.currencies.cents,
				yc: 0,
				tc: 0,
				finished: false,
				loading: false,
				other: msg.author.id
			};

			let msg1 = await msg.author.send(embed1);
			let msg2 = await other.send(embed2);

			userData.trading.session.message = msg1.id;
			otherData.trading.session.message = msg2.id;

			send("Let the trading commence!");
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			await firestore.doc(`/users/${other.id}`).set(otherData);
		});
	}
};