const Discord = require('discord.js');

const check = require(`${__dirname}/../../tools/check`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "flipbet",
	description: "Start a flip bet, where people can add cents and hope to win!",
	argument: "The amount of cents you want to bet initially",
	perms: "Embed Links",
	tips: "",
	aliases: ["coinbet", "groupbet"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		send.sendChannel({ channel: message.channel, author: message.author }, { content: "Starting bet ... " });

		let amt = Number(args[0]);
		if (isNaN(amt) || amt == undefined || amt < 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You have to bet a number of cents to start with!" });
		if (userData.currencies.cents < amt) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that many cents!" });
		if (amt < 10) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, the default minimum is 10 cents! You can change this once you start the bet." });

		let bal = userData.currencies.cents;
		bal = Number(bal) - Number(amt);
		userData.currencies.cents = bal;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		const embed = new Discord.MessageEmbed()
			.setTitle("A coin bet has been started!")
			.setDescription(`${message.author} started a coin bet!\nUse \`join <amt>\` to join!\nHost, use \`setmin <amt>\` to change the minimum amount!`)
			.setColor("#a600ff");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

		let min = 10;
		let cents = amt;
		let host = message.author.id;
		let users = [];
		let datas = [];
		let going = true;

		users.push(message.author.id);
		datas.push(userData);

		function messageTracker() {
			setTimeout(async () => {
				if (going == true) await messageTracker();
			}, 10);
			message.channel.awaitMessages(m => m.content, { max: 1, time: 10 }).then(async collected => {
				collected.forEach(async msg => {
					if (msg === undefined) return;
					if (going == false) return;
					let content = msg.content.toLowerCase();

					if (content.startsWith("setmin") && msg.author.id == host) {
						amt = content.slice(7);
						if (isNaN(amt) || amt % 1 != 0 || amt == undefined) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "You have to set it to a valid number!" });
						if (amt == 0 || amt < 0) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "You need to set it to at least 1!" });

						min = Number(amt);
						send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `You set the minimum amount of cents to \`${min}\`!` });
					}
					if (content.startsWith("join")) {
						if (users.includes(msg.author.id)) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "You already joined the flip bet!" });
						amt = content.slice(5);

						if (isNaN(amt) || amt % 1 != 0 || amt == undefined) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "You have to set it to a valid number!" });
						if (amt == 0 || amt < 0) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "You need to set it to at least 1!" });
						if (amt < min) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `Sorry, the minimum amount of cents to bet is ${min}!` });

						await check(firebase, msg.author.id);
						let localdata = await firebase.doc(`/users/${msg.author.id}`).get();
						let localData = localdata.data();
						if (localData.currencies.cents < amt) return send.sendChannel({ channel: msg.channel, author: msg.author }, { content: "Sorry, you don't have that many cents!" });

						amt = Number(amt);
						bal = localData.currencies.cents;
						bal = Number(bal) - Number(amt);

						localData.currencies.cents = bal;
						await firebase.doc(`/users/${msg.author.id}`).set(localData);

						users.push(msg.author.id);
						datas.push(localData);
						cents = Number(cents) + Number(amt);

						send.sendChannel({ channel: msg.channel, author: msg.author }, { content: `You added ${amt} to the stack! There are now ${cents} cents on the table!` });

					}
				});
			});
		}

		messageTracker();

		setTimeout(async () => {
			going = false;
			let userId = users[Math.floor(Math.random() * users.length)];
			let ld = datas[users.indexOf(userId)];
			let winnerBal = ld.currencies.cents;

			winnerBal = Number(winnerBal) + Number(cents);
			ld.currencies.cents = winnerBal;

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `A total of ${users.length} users participated in this flip bet, and <@${userId}> won!\nThey won ${cents} cents!` });

			await firebase.doc(`/users/${userId}`).set(ld);
		}, 60000);
	}
};