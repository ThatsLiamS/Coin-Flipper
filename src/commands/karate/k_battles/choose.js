const start = require(`${__dirname}/../k_tools/start`);
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "choose",
	aliases: ["pick"],
	execute: async function(message, args, prefix, client, kd, [firebase, data]) {

		let userData = data.data();
		if (message.guild) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to do this in a DM!" });
		let ability = args[1];
		let abilityList = ["flip", "spin", "slide", "dive", "swipe", "slice"];
		let myAbilities = kd.abilities;

		if (kd.battles.choosing == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You're not choosing abilities!" });
		if (!abilityList.includes(ability)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That isn't a valid ability!" });
		if (myAbilities[ability] == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have that ability!" });
		if (kd["battles"]["chosen"][ability] == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already chose that ability!" });

		kd["battles"]["chosen"][ability] = true;
		userData.karate = kd;
		let extra = "";
		let aVal = 0;
		let abilitiesList = ["flip", "spin", "slide", "dive", "swipe", "slice"];

		for (let ab of abilitiesList) {
			if (kd["battles"]["chosen"][ab] == true) aVal++;
		}
		if (aVal == 3) {
			kd.battles.choosing = false;
			extra = "\nYou finished choosing your abilities! Please wait until the battle begins!";
		}
		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You chose the ability **${ability}**!${extra}` });

		userData.karate = kd;

		await firebase.doc(`/users/${message.author.id}`).set(userData);

		if (aVal == 3) {

			let odata = await firebase.doc(`/users/${kd.battles.against}`).get();
			let oData = odata.data();

			let ok = oData.karate;
			let oUser = client.users.cache.get(kd.battles.against.toString());

			if (!oUser) oUser = { id: kd.battles.against };

			if (ok.battles.choosing == false) {

				setTimeout(async () => {
					start(message.author, oUser, userData, oData, firebase, client);
				}, 2500);

			}
		}
	}
};