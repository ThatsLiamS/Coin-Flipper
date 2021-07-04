const toSell = require("../../tools/constants").dropshipItems;
module.exports = {
	name: "dropship",
	description: "Dropship an item and get some cents for it!",
	argument: "None",
	perms: "",
	tips: "Two items will have a semi-small value, while one of them will have a huge value",
	cooldowny: "10 seconds",
	cooldown: 10000,
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let sell1 = toSell[Math.floor(Math.random() * toSell.length)];
		let sell2 = toSell[Math.floor(Math.random() * toSell.length)];
		let sell3 = toSell[Math.floor(Math.random() * toSell.length)];
		let fullList = [sell1, sell2, sell3];
		let cents1 = 0;
		let cents2 = 0;
		let cents3 = 0;
		let normalMin = 20;
		let normalMax = 100;
		let hugeMin = 300;
		let hugeMax = 700;
		if (userData.inv.packages > 0) {
			normalMin = 50;
			normalMax = 150;
			hugeMin = 500;
			hugeMax = 1000;
		}
		let random = Math.random() * 10;
		if (random < 3.33) {
			cents1 = Math.floor(Math.random() * (hugeMax - hugeMin + 1)) + hugeMin;
			cents2 = Math.floor(Math.random() * (normalMax - normalMin + 1)) + normalMin;
			cents3 = Math.floor(Math.random() * (normalMax - normalMin + 1)) + normalMin;
		}
		else if (random < 6.66) {
			cents2 = Math.floor(Math.random() * (hugeMax - hugeMin + 1)) + hugeMin;
			cents1 = Math.floor(Math.random() * (normalMax - normalMin + 1)) + normalMin;
			cents3 = Math.floor(Math.random() * (normalMax - normalMin + 1)) + normalMin;
		}
		else{
			cents3 = Math.floor(Math.random() * (hugeMax - hugeMin + 1)) + hugeMin;
			cents2 = Math.floor(Math.random() * (normalMax - normalMin + 1)) + normalMin;
			cents1 = Math.floor(Math.random() * (normalMax - normalMin + 1)) + normalMin;
		}
		if (userData.evil == true) {
			if (cents1 > 150) cents1 = 150;
			if (cents2 > 150) cents2 = 150;
			if (cents3 > 150) cents3 = 150;
		}
		let fullPriceList = [cents1, cents2, cents3];
		userData.list = fullList;
		userData.priceList = fullPriceList;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`What do you want to dropship? (One of them may do really well)\n\`${sell1}\`\n\`${sell2}\`\n\`${sell3}\``);
		msg.channel.awaitMessages(m => m.author.id == msg.author.id, { max: 1, time: 20000 }).then(async collected => {
			if (!collected.first()) {
				send("You didn't choose one of the items :/");
				return;
			}
			let firstMsg = collected.first();
			let content = firstMsg.content.toLowerCase();
			if (!fullList.includes(content)) return send("That's not a valid item!");
			let amt = fullPriceList[fullList.indexOf(content)];
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(amt);
			userData.currencies.cents = bal;
			await firestore.doc(`/users/${firstMsg.author.id}`).set(userData);
			send(`You dropshipped the ${content} for \`${amt}\` cents!`);
		});
	}
};