const turn = require(`${__dirname}/../k_tools/turn`);
const win = require(`${__dirname}/../k_tools/win`);
module.exports = {
	name: "attack",
	execute: async function(firestore, args, command, msg, discord, data, send, kd, bot) {
		let userData = data.data();
		if (kd.battles.in_battle == false) return send("You're not in a battle! What are you attacking?");
		if (kd.battles.turn == false) return send("It's not your turn don't cheat");

		let abilityChoices = "";
		let abList = [];
		let abilitiesList = ["flip", "spin", "slide", "dive", "swipe", "slice"];
		for (let ab of abilitiesList) {
			if (kd["battles"]["chosen"][ab] == true) abList.push(ab);
		}
		for (let ab of abList) {
			if (abilityChoices == "") { abilityChoices = ab; }
			else { abilityChoices = abilityChoices + `\n${ab}`; }
		}
		send(`Which ability do you want to use? Options:\n${abList.join(", ")}`);

		msg.channel.awaitMessages(m => m.author.id == msg.author.id, { max: 1, time: 10000 }).then(async collected => {
			if (!collected.first()) {
				return send("You didn't answer :/");
			}
			let message = collected.first().content.toLowerCase();
			if (!abList.includes(message)) return send("You either don't have that ability, didn't choose it, or it doesn't exist");
			let listOfAbilities = ["flip", "spin", "slide", "dive", "swipe", "slice"];
			let staminaList = [1, 5, 8, 12, 16, 22];
			let attackList = [3, 6, 8, 12, 18, 24];
			let stam = kd.battles.st;
			let stCost = staminaList[listOfAbilities.indexOf(message)];
			let atPower = attackList[listOfAbilities.indexOf(message)];
			if (stam < stCost) return send(`You don't have enough stamina to use this ability!\n\n**Important Note:**\nIf you can't use any ability, use \`c!karate use <item>\` to use a stamina healing item!\n(Or use \`c!karate forfeit\` if you don't have any)`);
			let other = kd.battles.against;
			let otherdata = await firestore.doc(`/users/${other}`).get();
			let otherData = otherdata.data();
			let ok = otherData.karate;
			let hp = ok.battles.hp;
			hp = Number(hp) - Number(atPower);
			stam = Number(stam) - Number(stCost);
			kd.battles.st = stam;
			if (hp < 1) {
				win(msg.author.id, otherData, userData, firestore, bot);
			}
			else {
				ok.battles.hp = hp;
				userData.karate = kd;
				otherData.karate = ok;
				send(`${kd.name} used **${message}** on ${ok.name}! Now they have ${hp} HP left!`);
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
				await firestore.doc(`/users/${other}`).set(otherData);
				turn(msg.author.id, other, userData, firestore, bot);
			}
		});
	}
};