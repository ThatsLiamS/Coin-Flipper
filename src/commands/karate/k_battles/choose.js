const start = require(`${__dirname}/../k_tools/start`);
module.exports = {
	name: "choose",
	aliases: ["pick"],
	execute: async function(firestore, args, command, msg, discord, data, send, kd, bot) {
		let userData = data.data();
		if (msg.guild) return send("You need to do this in a DM!");
		let ability = args[1];
		let abilityList = ["flip", "spin", "slide", "dive", "swipe", "slice"];
		let myAbilities = kd.abilities;

		if (kd.battles.choosing == false) return send("You're not choosing abilities!");
		if (!abilityList.includes(ability)) return send("That isn't a valid ability!");
		if (myAbilities[ability] == false) return send("You don't have that ability!");
		if (kd["battles"]["chosen"][ability] == true) return send("You already chose that ability!");

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
		send(`You chose the ability **${ability}**!${extra}`);
		userData.karate = kd;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		if (aVal == 3) {
			let odata = await firestore.doc(`/users/${kd.battles.against}`).get();
			let oData = odata.data();
			let ok = oData.karate;
			let oUser = bot.users.cache.get(kd.battles.against.toString());
			if (!oUser) oUser = { id: kd.battles.against };
			if (ok.battles.choosing == false) {
				setTimeout(async () => {
					start(msg.author, oUser, userData, oData, firestore, bot);
				}, 2500);
			}
		}
	}
};