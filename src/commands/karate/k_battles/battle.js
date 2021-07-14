const check = require(`${__dirname}/../../../tools/check`);
const start = require(`${__dirname}/../k_tools/start`);
const reset = require(`${__dirname}/../k_tools/reset`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "battle",
	aliases: ["fight"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		let user = message.mentions.users.first();

		if (!user) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to mention a user to battle!" });

		await check(firebase, user.id);

		let otherdata = await firebase.doc(`/users/${user.id}`).get();
		let otherData = otherdata.data();
		let ok = otherData.karate;

		if (kd.battles.askedBy != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Someone already asked you to battle!" });
		if (kd.battles.askedTo != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already asked someone to battle!" });
		if (kd.battles.in_battle == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're in a battle right now!" });
		if (ok.battles.askedBy != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Someone already asked them to battle!" });
		if (ok.battles.askedTo != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "They already asked someone else to battle!" });
		if (ok.battles.in_battle == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "They're in a battle right now!" });

		let uVal = 0;
		let oVal = 0;
		let abilitiesList = ["flip", "spin", "slide", "dive", "swipe", "slice"];

		for (let ab of abilitiesList) {
			if (kd["abilities"][ab] == true) uVal++;
			if (ok["abilities"][ab] == true) oVal++;
		}
		if (uVal < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You have no abilities! You can't battle!" });
		if (oVal < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "They have no abilities! They can't battle!" });

		kd.battles.against = user.id;
		ok.battles.against = message.author.id;
		kd.battles.askedTo = user.id;
		ok.battles.askedBy = message.author.id;
		userData.karate = kd;
		otherData.karate = ok;

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		await firebase.doc(`/users/${user.id}`).set(otherData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `<@${user.id}>, <@${message.author.id}> has asked you to battle! Type \`accept\` or \`decline\`!\nNote: make sure that both of your DMs are open` });

		message.channel.awaitMessages(m => m.author.id == user.id, { max: 1, time: 30000 }).then(async collected => {
			if (!collected.first()) {
				reset(message.author.id, user.id, userData, otherData, firebase);
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't respond :/" });
				return;
			}

			let msg = collected.first().content.toLowerCase();
			if (msg == "decline" || msg == "deny") {
				reset(message.author.id, user.id, userData, otherData, firebase);
				send.sendChannel({ channel: message.channel, author: message.author }, { content: `<@${message.author.id}>, <@${user.id}> denied your battle request!` });
			}
			else if (msg == "accept") {
				kd.battles.chosen = {
					flip: false,
					spin: false,
					slide: false,
					dive: false,
					swipe: false,
					slice: false
				};
				ok.battles.chosen = {
					flip: false,
					spin: false,
					slide: false,
					dive: false,
					swipe: false,
					slice: false
				};
				ok.battles.first = true;
				kd.battles.guild = message.guild.id;
				ok.battles.guild = message.guild.id;
				kd.battles.channel = message.channel.id;
				ok.battles.channel = message.channel.id;

				let userAbilities = [];
				let otherAbilities = [];

				for (let ab of abilitiesList) {
					if (kd["abilities"][ab] == true) userAbilities.push(ab);
					if (ok["abilities"][ab] == true) otherAbilities.push(ab);
				}

				let yourMsg = "";
				let otherMsg = "";
				let bothLess = true;
				if (userAbilities.length == 1) {
					yourMsg = `You only have one ability so it has been chosen as **${userAbilities[0]}**`;
					kd["battles"]["chosen"][userAbilities[0]] = true;
				}
				else if (userAbilities.length == 2) {
					yourMsg = `You only have two abilities so they have been chosen as **${userAbilities[0]}** and **${userAbilities[1]}**`;
					kd["battles"]["chosen"][userAbilities[0]] = true;
					kd["battles"]["chosen"][userAbilities[1]] = true;
				}
				else if (userAbilities.length == 3) {
					yourMsg = `You only have two abilities so they have been chosen as **${userAbilities[0]}**, **${userAbilities[1]}**, and **${userAbilities[2]}**`;
					kd["battles"]["chosen"][userAbilities[0]] = true;
					kd["battles"]["chosen"][userAbilities[1]] = true;
					kd["battles"]["chosen"][userAbilities[2]] = true;
				}
				else {
					yourMsg = `Choose your abilities! Do \`c!karate choose <ability> to choose it!\``;
					kd.battles.choosing = true;
					bothLess = false;
				}

				if (otherAbilities.length == 1) {
					otherMsg = `You only have one ability so it has been chosen as **${otherAbilities[0]}**`;
					ok["battles"]["chosen"][otherAbilities[0]] = true;
				}
				else if (otherAbilities.length == 2) {
					otherMsg = `You only have two abilities so they have been chosen as **${otherAbilities[0]}** and **${otherAbilities[1]}**`;
					ok["battles"]["chosen"][otherAbilities[0]] = true;
					ok["battles"]["chosen"][otherAbilities[1]] = true;
				}
				else if (otherAbilities.length == 3) {
					otherMsg = `You only have three abilities so they have been chosen as **${otherAbilities[0]}**, **${otherAbilities[1]}**, and **${otherAbilities[2]}**`;
					ok["battles"]["chosen"][otherAbilities[0]] = true;
					ok["battles"]["chosen"][otherAbilities[1]] = true;
					ok["battles"]["chosen"][otherAbilities[2]] = true;
				}
				else {
					otherMsg = `Choose your abilities! Do \`c!karate choose <ability> to choose it!\``;
					ok.battles.choosing = true;
					bothLess = false;
				}

				let dmsOpen = true;
				message.author.send(yourMsg).catch(async () => {
					dmsOpen = false;
				});
				user.send(otherMsg).catch(async () => {
					dmsOpen = false;
				});

				if (dmsOpen == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Both users need to open their DMs for this to work!" });

				send.sendChannel({ channel: message.channel, author: message.author }, { content: "You have both gotten DMs explaining which abilities you can choose! If both of you have less than 4 abilities, the battle will begin shortly! Otherwise, you must choose which abilities you want!" });

				await firebase.doc(`/users/${message.author.id}`).set(userData);
				await firebase.doc(`/users/${user.id}`).set(otherData);

				if (bothLess == true) {
					setTimeout(async () => {
						start(message.author, user, userData, otherData, firebase, client);
					}, 5000);
				}
			}
			else {
				reset(message.author, user, userData, otherData, firebase);
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid choice!" });

			}
		});
	}
};