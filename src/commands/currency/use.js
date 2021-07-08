const Discord = require('discord.js');

const itemlist = require(`${__dirname}/../../tools/constants`).itemlist;
const achievementAdd = require(`${__dirname}/../../tools/achievementAdd`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "use",
	description: "Use an item in your inventory!",
	argument: "The item you want to use",
	perms: "Embed Links",
	tips: "Only a few items work with this command - use `c!status` to see the effects of most other items",
	aliases: ["useitem"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let itemName = args[0];
		let item;

		function findItem() {
			for (let i of itemlist) {
				if (i.name == itemName) item = i;
				if (i.aliases.includes(itemName)) item = i;
			}
		}
		let done = false;
		for (let i = 0; i < 5; i++) {
			if (done == false) {
				itemName = args.slice(0, i + 1).join(" ");
				findItem();
				if (item !== undefined) done = true;
			}
		}
		if (itemName.startsWith("gift") || itemName.startsWith("present") || itemName.startsWith("giftbox")) {
			if (userData.inv.gift5000 > 0) item = itemlist.find(ite => ite.id == "gift5000");
			else if (userData.inv.gift10000 > 0) item = itemlist.find(ite => ite.id == "gift10000");
			else if (userData.inv.gift50000 > 0) item = itemlist.find(ite => ite.id == "gift50000");
			else if (userData.inv.gift100000 > 0) item = itemlist.find(ite => ite.id == "gift100000");
			else if (userData.inv.gift500000 > 0) item = itemlist.find(ite => ite.id == "gift500000");
			else return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid item!" });
		}
		if (!item) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid item!" });

		let itemAmt = userData["inv"][item.id];
		if (itemAmt === undefined) itemAmt = 0;
		if (itemAmt < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that item!" });

		if (item.use == "status") { return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Use `c!status` to see the use of this item!" }); }
		else if (item.use.startsWith("function")) {
			if (item.use == "function1") return function1();
			if (item.use == "function2") return function2();
			if (item.use == "function3") return function3();
			if (item.use == "function4") return function4();
			// if (item.use == "function5") return function5();
			if (item.use == "function6") return function6();
		}
		else {
			return send.sendChannel({ channel: message.channel, author: message.author }, { content: item.use });
		}

		async function function4() {
			let amt = args[1];
			if (!amt) amt = args[2];
			if (!amt) amt = 1;
			if (amt == "all") {
				amt = itemAmt;
				if (!amt) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You have no briefcases!" });
			}
			else {
				amt = Number(amt);
				if (isNaN(amt)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid amount of briefcases!" });
			}
			if (itemAmt < amt) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that many briefcases!" });
			let totalAmt = 0;
			for (let i = 0; i < amt; i++) {
				let briefcaseAmt = Math.ceil(Math.random() * (750 - 250) + 250);
				if (userData.evil == true) briefcaseAmt = Math.ceil(briefcaseAmt * 0.9);

				totalAmt = Number(totalAmt) + Number(briefcaseAmt);
				let bal = userData.currencies.cents;
				bal = Number(bal) + Number(briefcaseAmt);
				userData.currencies.cents = bal;

				let briefcases = userData.inv.briefcase;
				briefcases = Number(briefcases) - Number(1);
				userData.inv.briefcase = briefcases;
			}
			if (amt == 1) send.sendChannel({ channel: message.channel, author: message.author }, { content: `You opened the briefcase and got ${totalAmt} cents!` });
			else send.sendChannel({ channel: message.channel, author: message.author }, { content: `You opened the briefcases and got a total of ${totalAmt} cents!` });
			await firebase.doc(`/users/${message.author.id}`).set(userData);
		}

		async function function1() {
			let responses = ["Ask again later", "Idk", "Sorry I dont know", "Why would I know", "Yes... or no... yeah idk", "Signs point to nowhere", "As I see it... i forgot", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on me knowing", "It is uncertain", "My reply is maybe", "My sources are not credible so idk", "Outlook blank", "Reply hazy, try again", "Without a doubt I have no idea", "50% yes, 50% no"];
			let response = responses[Math.floor(Math.random() * responses.length)];
			const embed = new Discord.MessageEmbed()
				.setTitle("The magic 8ball says....")
				.setDescription(response)
				.setFooter("What do you expect its a broken 8ball")
				.setColor("#828282");
			let localData = await achievementAdd(userData, "whatAWaste", true);
			if (localData) {
				userData = localData;
				await firebase.doc(`/users/${message.author.id}`).set(userData);
			}
			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

		}

		async function function2() {
			let multiplier = userData.currencies.multiplier;
			if (multiplier == undefined) multiplier = 1;
			multiplier = Number(multiplier) + Number(0.5);
			userData.currencies.multiplier = multiplier;

			let smoothies = userData.inv.smoothie;
			smoothies = Number(smoothies) - Number(1);
			userData.inv.smoothie = smoothies;

			await firebase.doc(`/users/${message.author.id}`).set(userData);

			const embed = new Discord.MessageEmbed()
				.setTitle("🥤 You used the smoothie!")
				.setDescription("You drank it, and it was so good that you gained a 1.5x multiplier when flipping coins! This multiplier will last 10 minutes, so use it quick!\n\nThe smoothie was also so good that you feel like you should view our partner's bot, created by one of the devs of Coin Flipper!\nhttps://smoothiestand.web.app/")
				.setColor("#ffa6f9");
			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

			setTimeout(async () => {
				data = await firebase.doc(`/users/${message.author.id}`).get();
				userData = data.data();
				userData.currencies.multiplier = 1;
				await firebase.doc(`/users/${message.author.id}`).set(userData);
			}, 600000);
		}

		async function function3() {
			const embed = new Discord.MessageEmbed()
				.setTitle("🍪 The Cookie World 🍪")
				.setDescription("You close your eyes and eat the delicious cookie. But when you open your eyes, you're inside the **Cookie World**!\nWhat do you do here, you may ask? I have no idea. But you can get some cookies by using the `c!click` command!\n\nBy the way to your right you see a cool cookie bot and it looks like you should check it out:\nhttps://top.gg/bot/789327073663516673")
				.setColor("945600");
			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
		}

		async function function6() {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "Do you want to open this gift? (you can also give it to someone with `c!giveitem`)\n`yes` or `no`" });
			await message.channel.awaitMessages(m => m.author.id == message.author.id, { time: 30000, max: 1 }).then(async collected => {

				let msg = collected.first();
				if (!msg) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't respond in time!" });
				let content = msg.content.toLowerCase().trim();

				if (content == "yes") {

					let amt;
					if (item.id.endsWith("5000")) amt = 5000;
					if (item.id.endsWith("10000")) amt = 10000;
					if (item.id.endsWith("50000")) amt = 50000;
					if (item.id.endsWith("100000")) amt = 100000;
					if (item.id.endsWith("500000")) amt = 500000;

					let random = Math.random() * 100;
					let extra = "";
					if (random > 90) {
						let newItem;
						let random2 = Math.random() * 10;

						if (random2 < 2.5) newItem = itemlist.find(ite => ite.name == "gold disk");
						else if (random2 < 5) newItem = itemlist.find(ite => ite.name == "broken 8-ball");
						else if (random2 < 7.5) newItem = itemlist.find(ite => ite.name == "label");
						else newItem = itemlist.find(ite => ite.name == "soap");

						let items = userData.inv[newItem.id];
						if (items === undefined) items = 0;
						items++;
						userData.inv[newItem.id] = items;
						extra = `\nYou also got a ${newItem.name}!`;
					}

					userData.currencies.cents = userData.currencies.cents + amt;
					userData.inv[`gift${amt}`] = userData.inv[`gift${amt}`] - 1;
					send.sendChannel({ channel: message.channel, author: message.author }, { content: `You opened the gift and got ${amt} cents!${extra}\n\nMake sure to thank who gave it to you! (unless you bought it)` });

					await firebase.doc(`/users/${message.author.id}`).set(userData);
				}
				else {
					send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Okay!' });
				}
			});
		}
	}
};