const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
module.exports = {
	name: "setaddress",
	description: "Set your address to any number you want!",
	argument: "The address ID you want to change it to",
	perms: "",
	tips: "Online has to be enabled to use this, and you need a microphone to do it",
	aliases: ["updatecode", "setcode", "updateaddress", "updateadress", "setadress"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;

		let userData = data.data();
		let array = await checkOnline(firestore, msg.author.id, userData);
		let online = array[0];
		userData = array[1];
		if (online == false) return;

		let mics = userData.inv.microphone;
		if (mics == undefined) mics = 0;
		if (mics < 1 && userData.donator < 1) return send("You need a microphone or to be a donator to change your address!");

		let newAdress = args[0];
		if (!args[0]) return send("You have to include what you want to set your address to!");
		if (isNaN(newAdress) && userData.donator < 1) return send("Your address has to be a number! (Unless you're a donator)");
		if (!isNaN(newAdress)) newAdress = Number(newAdress);
		let valid = true;
		if (!isNaN(newAdress)) {
			if (newAdress < 0 || newAdress % 1 != 0) valid = false;
		}
		if (valid == false) return send("You need a valid number!");

		let onlinedata = await firestore.doc(`/online/codes`).get();
		let onlineData = onlinedata.data();
		let codes = onlineData.codes;
		if (codes.includes(newAdress)) return send("There's already an address with that ID!");
		let address = userData.online.friendCode;
		let index = codes.indexOf(address);
		codes[index] = newAdress;
		onlineData.codes = codes;
		delete onlineData[address];
		onlineData[newAdress] = msg.author.id;
		userData.online.friendCode = newAdress;

		await firestore.doc(`/users/${msg.author.id}`).set(userData);send(`You set your address ID to \`${newAdress}\`!`);
		await firestore.doc(`/online/codes`).set(onlineData);
	}
};