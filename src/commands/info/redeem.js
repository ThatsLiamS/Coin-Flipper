const gotItem = require(`${__dirname}/../../tools/gotItem`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "redeem",
	description: "Redeem a code that you found!",
	argument: "The code you want to redeem",
	perms: "",
	tips: "Developers with a toolbox cannot claim codes",
	aliases: ["redeemcode"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, I must have the Manage Messages permission to use this! (so I can delete the code)" });

		let userData = data.data();
		if (args[0] == process.env.CODE_1) {

			let onlinedata = await firebase.doc(`/online/claimed`).get();
			let onlineData = onlinedata.data();
			let has = onlinedata.has;

			await message.delete();

			if (has == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Somebody already claimed the code! :0" });
			let codes = userData.codes;

			if (codes) {
				if (codes.includes(process.env.CODE_1)) send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already claimed that code!" });
				return;
			}
			onlineData.has = true;

			await firebase.doc(`/online/claimed`).set(onlineData);

			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(50000);
			userData.currencies.cents = bal;

			await firebase.doc(`/users/${message.author.id}`).set(userData);
			await firebase.doc(`/users/${message.author.id}`).update({ codes: firebase.FieldValue.arrayUnion(process.env.CODE_1) });

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `Congratulations, <@${message.author.id}>, you claimed a major code and got \`50,000\` cents!` });

		}
		else if (args[0] == process.env.CODE_2) {

			await message.delete();

			if (userData.inv.toolbox == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content:  "Sorry, developers with toolboxes can't use this command!" });

			let codes = userData.codes;
			if (codes) {
				if (codes.includes(process.env.CODE_2)) send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already claimed that code!" });
				return;
			}

			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(500);
			userData.currencies.cents = bal;

			let disks = userData.inv.goldDisk;
			disks = Number(disks) + Number(1);
			userData.inv.goldDisk = disks;

			userData = await gotItem(userData);

			await firebase.doc(`/users/${message.author.id}`).set(userData);
			await firebase.doc(`/users/${message.author.id}`).update({ codes: firebase.FieldValue.arrayUnion(process.env.CODE_2) });

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `Congratulations, <@${message.author.id}>, you claimed a major code and got \`500\` cents and a 📀 gold disk!` });

		}
		else if (args[0] == process.env.CODE_3) {

			await message.delete();
			if (userData.inv.toolbox == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, developers with toolboxes can't use this command!" });
			let codes = userData.codes;

			if (codes) {
				if (codes.includes(process.env.CODE_3)) send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already claimed that code!" });
				return;
			}
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(500);
			userData.currencies.cents = bal;

			await firebase.doc(`/users/${message.author.id}`).set(userData);
			await firebase.doc(`/users/${message.author.id}`).update({ codes: firebase.FieldValue.arrayUnion(process.env.CODE_3) });

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `Congratulations, <@${message.author.id}>, you claimed a minor code and got \`500\` cents!` });

		}

		else {
			send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid code!" });

		}
	}
};