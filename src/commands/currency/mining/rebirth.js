const checkMining = require(`${__dirname}/../../../tools/checkMining`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "rebirth",
	description: "Rebirth in mining - restart your stats and get gems easier!",
	argument: "None",
	perms: "",
	aliases: ["miningrebirth", "miningrestart"],
	tips: "You can only use this if you have a pickaxe",
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.inv.pickaxe < 1 || userData.inv.pickaxe === undefined) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a pickaxe to use this!" });

		userData = await checkMining(firebase, message.author, userData);
		let miningData = userData.mining;

		let easier = miningData.easier;
		if (!easier) easier = 0;
		let req;

		if (easier == 0) req = ["banana", "steel", "infinitystone"];
		else if (easier == 10) req = ["steel", "infinitystone"];
		else if (easier == 20) req = ["infinitystone"];
		else return send("You can't upgrade your pickaxe anymore!");

		if (!req.includes(miningData.pickaxe)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: `To rebirth, you need a **${req[0]}** pickaxe!` });
		miningData = {
			pickaxe: "standard",
			easier: easier + 10,
			rock: 0,
			sapphire: 0,
			ruby: 0,
			opal: 0,
			diamond: 0,
			banana: 0,
			steel: 0,
			infinitystone: 0
		};

		userData.mining = miningData;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `**You rebirth!**\n\nYou now have a ${easier + 10}% greater chance to get gems!` });

	}
};