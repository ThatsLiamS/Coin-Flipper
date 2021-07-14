const gotAddon = require(`${__dirname}/../../../tools/gotAddon`);
const send = require(`${__dirname}/../../../tools/send`);

const abilityList = ["flip", "spin", "slide", "dive", "swipe", "slice"];
const levelList = [1, 2, 4, 6, 10, 16];

module.exports = {
	name: "gain",
	aliases: ["learn", "ability"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();

		if (kd.battles.in_battle === true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're in a battle!" });
		if (!args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You must specify an ability to gain!" });
		if (!abilityList.includes(args[1])) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid ability! (use `c!karate abilities`)" });

		let levelCost = levelList[abilityList.indexOf(args[1])];

		if (kd.level < levelCost) return send.sendChannel({ channel: message.channel, author: message.author }, { content: `Sorry, you have to be at level ${levelCost} to gain that ability!` });
		if (kd["abilities"][args[1]] === true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have that ability!" });

		kd["abilities"][args[1]] = true;
		userData.karate = kd;
		userData = await gotAddon(userData);

		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You got the **${args[1]}** ability!` });

	}
};