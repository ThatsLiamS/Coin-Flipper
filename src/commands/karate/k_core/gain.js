const gotAddon = require("../../../tools/gotAddon");
module.exports = {
	name: "gain",
	aliases: ["learn", "ability"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd) {
		let userData = data.data();
		if (kd.battles.in_battle === true) return send("You're in a battle!");
		let abilityList = ["flip", "spin", "slide", "dive", "swipe", "slice"];
		let levelList = [1, 2, 4, 6, 10, 16];
		if (!args[1]) return send("You must specify an ability to gain!");
		if (!abilityList.includes(args[1])) return send("That's not a valid ability! (use `c!karate abilities`)");
		let levelCost = levelList[abilityList.indexOf(args[1])];
		if (kd.level < levelCost) return send(`Sorry, you have to be at level ${levelCost} to gain that ability!`);
		if (kd["abilities"][args[1]] === true) return send("You already have that ability!");
		kd["abilities"][args[1]] = true;
		userData.karate = kd;
		userData = await gotAddon(userData);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You got the **${args[1]}** ability!`);
	}
};