const Discord = require("discord.js");

module.exports = async function turn(oldId, newId, data, firebase, client) {
	setTimeout(async () => {

		data = await firebase.doc(`/users/${oldId}`).get();
		data = data.data();

		let otherData = await firebase.doc(`/users/${newId.toString()}`).get();
		let otherdata = otherData.data();

		const embed = new Discord.MessageEmbed()
			.setTitle(`It's your turn, ${otherdata.karate.name}!`)
			.addField("Health:", otherdata.karate.battles.hp)
			.addField("Stamina:", otherdata.karate.battles.st)
			.setColor('RED');

		data.karate.battles.turn = false;
		otherdata.karate.battles.turn = true;

		let channel = client.channels.cache.get(data.karate.battles.channel.toString());
		channel.send(embed).catch(() => {});

		await firebase.doc(`/users/${oldId}`).set(data);
		await firebase.doc(`/users/${newId}`).set(otherdata);

	}, 4000);

};