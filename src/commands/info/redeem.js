const gotItem = require("../../tools/gotItem");
module.exports = {
	name: "redeem",
	description: "Redeem a code that you found!",
	argument: "The code you want to redeem",
	perms: "",
	tips: "Developers with a toolbox cannot claim codes",
	aliases: ["redeemcode"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (!msg.guild.me.hasPermission("MANAGE_MESSAGES")) return send("Sorry, I must have the Manage Messages permission to use this! (so I can delete the code)");

		let userData = data.data();
		if (args[0] == process.env.CODE_1) {
			let onlinedata = await firestore.doc(`/online/claimed`).get();
			let onlineData = onlinedata.data();
			let has = onlinedata.has;
			await msg.delete();
			if (has == true) return send("Somebody already claimed the code! :0");
			let codes = userData.codes;
			if (codes) {
				if (codes.includes(process.env.CODE_1)) send("You already claimed that code!");
				return;
			}
			onlineData.has = true;
			await firestore.doc(`/online/claimed`).set(onlineData);
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(50000);
			userData.currencies.cents = bal;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			await firestore.doc(`/users/${msg.author.id}`).update({ codes: firestore.FieldValue.arrayUnion(process.env.CODE_1) });
			send(`Congratulations, <@${msg.author.id}>, you claimed a major code and got \`50,000\` cents!`);
		}
		else if (args[0] == process.env.CODE_2) {
			await msg.delete();
			if (userData.inv.toolbox == true) return send("Sorry, developers with toolboxes can't use this command!");
			let codes = userData.codes;
			if (codes) {
				if (codes.includes(process.env.CODE_2)) send("You already claimed that code!");
				return;
			}
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(500);
			userData.currencies.cents = bal;
			let disks = userData.inv.goldDisk;
			disks = Number(disks) + Number(1);
			userData.inv.goldDisk = disks;
			userData = await gotItem(userData);
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			await firestore.doc(`/users/${msg.author.id}`).update({ codes: firestore.FieldValue.arrayUnion(process.env.CODE_2) });
			send(`Congratulations, <@${msg.author.id}>, you claimed a major code and got \`500\` cents and a 📀 gold disk!`);
		}
		else if (args[0] == process.env.CODE_3) {
			await msg.delete();
			if (userData.inv.toolbox == true) return send("Sorry, developers with toolboxes can't use this command!");
			let codes = userData.codes;
			if (codes) {
				if (codes.includes(process.env.CODE_3)) send("You already claimed that code!");
				return;
			}
			let bal = userData.currencies.cents;
			bal = Number(bal) + Number(500);
			userData.currencies.cents = bal;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
			await firestore.doc(`/users/${msg.author.id}`).update({ codes: firestore.FieldValue.arrayUnion(process.env.CODE_3) });
			send(`Congratulations, <@${msg.author.id}>, you claimed a minor code and got \`500\` cents!`);
		}
		else {
			send("That's not a valid code!");
		}
	}
};