const discord = require("discord.js");
module.exports = async function turn(oldId, newId, data, firestore, bot) {
	setTimeout(async () => {

		data = await firestore.doc(`/users/${oldId}`).get();
		data = data.data();

		let otherData = await firestore.doc(`/users/${newId.toString()}`).get();
		let otherdata = otherData.data();

		let embed = new discord.MessageEmbed()
			.setTitle(`It's your turn, ${otherdata.karate.name}!`)
			.addField("Health:", otherdata.karate.battles.hp)
			.addField("Stamina:", otherdata.karate.battles.st)
			.setColor('RED');

		data.karate.battles.turn = false;
		otherdata.karate.battles.turn = true;

		let channel = bot.channels.cache.get(data.karate.battles.channel.toString());
		channel.send(embed).catch(() => {});
		await firestore.doc(`/users/${oldId}`).set(data);
		await firestore.doc(`/users/${newId}`).set(otherdata);
	}, 4000);

};