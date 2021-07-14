const send = require(`${__dirname}/../../../tools/send`);
const turn = require(`${__dirname}/../k_tools/turn`);
const win = require(`${__dirname}/../k_tools/win`);

module.exports = {
	name: "attack",
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		if (kd.battles.in_battle == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're not in a battle! What are you attacking?" });
		if (kd.battles.turn == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "It's not your turn don't cheat" });

		let abilityChoices = "";
		let abList = [];
		let abilitiesList = ["flip", "spin", "slide", "dive", "swipe", "slice"];

		for (const ab of abilitiesList) {
			if (kd["battles"]["chosen"][ab] == true) abList.push(ab);
		}
		for (const ab of abList) {
			if (abilityChoices == "") { abilityChoices = ab; }
			else { abilityChoices = abilityChoices + `\n${ab}`; }
		}

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `Which ability do you want to use? Options:\n${abList.join(", ")}` });

		message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000 }).then(async collected => {
			if (!collected.first()) {
				return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't answer :/" });
			}
			let msg = collected.first().content.toLowerCase();

			if (!abList.includes(msg)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You either don't have that ability, didn't choose it, or it doesn't exist" });
			let listOfAbilities = ["flip", "spin", "slide", "dive", "swipe", "slice"];

			let staminaList = [1, 5, 8, 12, 16, 22];
			let attackList = [3, 6, 8, 12, 18, 24];
			let stam = kd.battles.st;

			let stCost = staminaList[listOfAbilities.indexOf(msg)];
			let atPower = attackList[listOfAbilities.indexOf(msg)];

			if (stam < stCost) return send.sendChannel({ channel: message.channel, author: message.author }, { content: `You don't have enough stamina to use this ability!\n\n**Important Note:**\nIf you can't use any ability, use \`c!karate use <item>\` to use a stamina healing item!\n(Or use \`c!karate forfeit\` if you don't have any)` });
			let other = kd.battles.against;

			let otherdata = await firebase.doc(`/users/${other}`).get();

			let otherData = otherdata.data();
			let ok = otherData.karate;
			let hp = ok.battles.hp;

			hp = Number(hp) - Number(atPower);
			stam = Number(stam) - Number(stCost);
			kd.battles.st = stam;

			if (hp < 1) {
				win(message.author.id, otherData, userData, firebase, client);
			}
			else {

				ok.battles.hp = hp;
				userData.karate = kd;
				otherData.karate = ok;

				send.sendChannel({ channel: message.channel, author: message.author }, { content: `${kd.name} used **${msg}** on ${ok.name}! Now they have ${hp} HP left!` });

				await firebase.doc(`/users/${message.author.id}`).set(userData);
				await firebase.doc(`/users/${other}`).set(otherData);

				turn(message.author.id, other, userData, firebase, client);
			}
		});
	}
};