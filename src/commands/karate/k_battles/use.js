const turn = require(`${__dirname}/../k_tools/turn`);
const send = require(`${__dirname}/../../../tools/send`);

const idList = ["band-aid", "soap", "fuel"];
const objList = ["bandaid", "soap", "fuel"];

module.exports = {
	name: "use",
	aliases: ["useitem"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();

		if (kd.battles.in_battle == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're not in a battle!" });
		if (kd.battles.turn == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "It's not your turn! Don't cheat" });
		if (!args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify an item to use!" });

		let item = args[1];
		if ((item == "band" && args[2] == "aid") || item == "bandaid") item = "band-aid";

		if (!idList.includes(item)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid item!" });
		let objItem = objList[idList.indexOf(item)];
		if (userData["inv"][objItem] < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that item!" });
		let msg = "";

		if (item == "band-aid") {

			let hp = kd.battles.hp;
			hp = Number(hp) + Number(10);
			let max = kd.battles.mhp;

			if (hp > max) hp = max;
			kd.battles.hp = hp;
			msg = "You used the 🩹 band-aid and restored 10 HP!";
		}
		else if (item == "soap") {

			let st = kd.battles.st;
			st = Number(st) + Number(5);
			let max = kd.battles.mst;

			if (st > max) st = max;
			kd.battles.st = st;
			msg = "You used the 🧼 soap and restored 5 ST!";
		}
		else {

			let st = kd.battles.st;
			st = Number(st) + Number(10);
			let max = kd.battles.mst;

			if (st > max) st = max;
			kd.battles.st = st;
			msg = "You used the ⛽ fuel and restored 10 ST!";
		}

		userData.karate = kd;
		let other = kd.battles.against;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: msg });

		turn(message.author.id, other, userData, firebase, client);
	}
};