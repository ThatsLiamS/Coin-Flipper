const toSell = require(`${__dirname}/../../tools/constants`).dropshipItems;
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "dropship",
	description: "Dropship an item and get some cents for it!",
	argument: "None",
	perms: "",
	tips: "Two items will have a semi-small value, while one of them will have a huge value",
	cooldowny: "10 seconds",
	cooldown: 10,
	execute: async function(message, args, prefix, client, [firebase, data]) {

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

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		send.sendChannel({ channel: message.channel, author: message.author }, { content: `What do you want to dropship? (One of them may do really well)\n\`${sell1}\`\n\`${sell2}\`\n\`${sell3}\`` });

		const filter = m => m.author.id == message.author.id;
		message.channel.awaitMessages({ filter, max: 1, time: 20000 }).then(async collected => {
			if (!collected.first()) {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't choose one of the items :/" });
				return;
			}
			let firstMsg = collected.first();
			let content = firstMsg.content.toLowerCase();
			if (!fullList.includes(content)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid item!" });

			let amt = fullPriceList[fullList.indexOf(content)];
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(amt);

			userData.currencies.cents = bal;
			await firebase.doc(`/users/${firstMsg.author.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You dropshipped the ${content} for \`${amt}\` cents!` });
		});
	}
};