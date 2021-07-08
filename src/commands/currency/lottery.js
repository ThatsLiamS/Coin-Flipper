const Discord = require('discord.js');

const alphabet = require(`${__dirname}/../../tools/constants`).normalCharacters;
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "lottery",
	description: "Buy a lottery ticket for 20 cents and you might even win!",
	argument: "None",
	perms: "Embed Links",
	tips: "You have to use `c!claimprize` after to claim your cents",
	cooldowny: "10 seconds",
	cooldown: 10000,
	aliases: ["ticket"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let bal = userData.currencies.cents;

		if (bal < 20) bal = "Sorry, lottery tickets cost 20 cents!";
		bal = Number(bal) - Number(20);
		userData.currencies.cents = bal;

		let numberList = [0, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
		if (userData.inv.luckypenny > 0) numberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

		let lucky1 = numberList[Math.floor(Math.random() * numberList.length)];
		let lucky2 = numberList[Math.floor(Math.random() * numberList.length)];
		let lucky3 = numberList[Math.floor(Math.random() * numberList.length)];

		let number1 = numberList[Math.floor(Math.random() * numberList.length)];
		let number2 = numberList[Math.floor(Math.random() * numberList.length)];
		let number3 = numberList[Math.floor(Math.random() * numberList.length)];
		let number4 = numberList[Math.floor(Math.random() * numberList.length)];
		let number5 = numberList[Math.floor(Math.random() * numberList.length)];
		let number6 = numberList[Math.floor(Math.random() * numberList.length)];

		function winAmt() {
			let theRandomNum = Math.random() * 10;
			let prize = 0;
			if (theRandomNum < 6) prize = 10;
			else if (theRandomNum < 7) prize = 20;
			else if (theRandomNum < 8) prize = 50;
			else if (theRandomNum < 9) prize = 500;
			else if (theRandomNum < 9.5) prize = 1000;
			else prize = 2000;
			return prize;
		}

		let winning1 = winAmt();
		let winning2 = winAmt();
		let winning3 = winAmt();
		let winning4 = winAmt();
		let winning5 = winAmt();
		let winning6 = winAmt();

		let id1 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id2 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id3 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id4 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id5 = alphabet[Math.floor(Math.random() * alphabet.length)];
		let id6 = alphabet[Math.floor(Math.random() * alphabet.length)];

		let fullId = `${id1}${id2}${id3}${id4}${id5}${id6}`;
		userData.lottery.id = fullId;
		let hasWon = false;
		let fullPrize = 0;

		if (number1 == lucky1 || number1 == lucky2 || number1 == lucky3) {
			hasWon = true;
			fullPrize += winning1;
		}
		if (number2 == lucky1 || number2 == lucky2 || number2 == lucky3) {
			hasWon = true;
			fullPrize += winning2;
		}
		if (number3 == lucky1 || number3 == lucky2 || number3 == lucky3) {
			hasWon = true;
			fullPrize += winning3;
		}
		if (number4 == lucky1 || number4 == lucky2 || number4 == lucky3) {
			hasWon = true;
			fullPrize += winning4;
		}
		if (number5 == lucky1 || number5 == lucky2 || number5 == lucky3) {
			hasWon = true;
			fullPrize += winning5;
		}
		if (number6 == lucky1 || number6 == lucky2 || number6 == lucky3) {
			hasWon = true;
			fullPrize += winning6;
		}
		userData.lottery.won = hasWon;
		userData.lottery.prize = fullPrize;


		const embed = new Discord.MessageEmbed()
			.setColor("GREEN")
			.setTitle("Lottery Ticket")
			.setDescription("Scratch off the lucky numbers and your numbers. If any of your numbers match any of the lucky numbers, scratch off the prize money to the right of it to see how muh you earned!\n**You must use `c!claimprize` to get your prize money!**")
			.addFields(
				{ name: "Lucky Numbers", value: `||${lucky1}||\n||${lucky2}||\n||${lucky3}||`, inline: true },
				{ name: "Your Numbers", value: `||${number1}||\n||${number2}||\n||${number3}||\n||${number4}||\n||${number5}||\n||${number6}||`, inline: true },
				{ name: "Prizes", value: `||${winning1}||\n||${winning2}||\n||${winning3}||\n||${winning4}||\n||${winning5}||\n||${winning6}||`, inline: true }
			);

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

		await firebase.doc(`/users/${message.author.id}`).set(userData);
	}
};