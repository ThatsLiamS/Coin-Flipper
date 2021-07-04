const turn = require(`${__dirname}/../k_tools/turn`);
module.exports = {
	name: "use",
	aliases: ["useitem"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd, bot) {
		let userData = data.data();
		if (kd.battles.in_battle == false) return send("You're not in a battle!");
		if (kd.battles.turn == false) return send("It's not your turn! Dont cheat");
		if (!args[1]) return send("You need to specify an item to use!");
		let item = args[1];
		if ((item == "band" && args[2] == "aid") || item == "bandaid") item = "band-aid";
		let idList = ["band-aid", "soap", "fuel"];
		let objList = ["bandaid", "soap", "fuel"];
		if (!idList.includes(item)) return send("That's not a valid item!");
		let objItem = objList[idList.indexOf(item)];
		if (userData["inv"][objItem] < 1) return send("You don't have that item!");
		let message = "";
		if (item == "band-aid") {
			let hp = kd.battles.hp;
			hp = Number(hp) + Number(10);
			let max = kd.battles.mhp;
			if (hp > max) hp = max;
			kd.battles.hp = hp;
			message = "You used the 🩹 band-aid and restored 10 HP!";
		}
		else if (item == "soap") {
			let st = kd.battles.st;
			st = Number(st) + Number(5);
			let max = kd.battles.mst;
			if (st > max) st = max;
			kd.battles.st = st;
			message = "You used the 🧼 soap and restored 5 ST!";
		}
		else {
			let st = kd.battles.st;
			st = Number(st) + Number(10);
			let max = kd.battles.mst;
			if (st > max) st = max;
			kd.battles.st = st;
			message = "You used the ⛽ fuel and restored 10 ST!";
		}
		userData.karate = kd;
		let other = kd.battles.against;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(message);
		turn(msg.author.id, other, userData, firestore, bot);
	}
};