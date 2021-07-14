const discord = require("discord.js");

const reset = require(`${__dirname}/reset`);
const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const gotItem = require(`${__dirname}/../../../tools/gotItem`);


module.exports = async function win(winnerId, otherdata, data, firebase, client) {

	let winner = client.users.cache.get(winnerId.toString());
	let loser = client.users.cache.get(data.karate.battles.against.toString());

	const embed = new discord.MessageEmbed()
		.setColor('RED')
		.setTitle(`${winner.username} won!`);

	let kd = data.karate;
	let xp = kd.xp;
	xp = Number(xp) + Number(20);
	kd.xp = xp;

	let level = kd.level;
	let levelUp = level * 20;

	if (level > levelUp) {

		level = Number(level) + Number(1);
		xp = xp - levelUp;

		if (xp < 0) xp = 0;
		if (level == 2) kd.belt = "red";
		if (level == 4) kd.belt = "yellow";
		if (level == 6) kd.belt = "orange";
		if (level == 9) kd.belt = "green";
		if (level == 12) kd.belt = "blue";
		if (level == 15) kd.belt = "purple";
		if (level == 16) data = await achievementAdd(data, "blackBelt");
		if (level == 21) kd.belt = "brown";
		if (level == 27) {

			kd.belt = "black";
			let uniforms = data.inv.masteruniform;

			if (uniforms === undefined) uniforms = 0;
			uniforms++;
			data.inv.masteruniform = uniforms;

			data = await achievementAdd(data, "theMaster");
			data = await gotItem(data);

		}
		kd.level = level;
		kd.xp = xp;
	}

	embed.setDescription(`**${kd.name}** won against **${otherdata.karate.name}**!\n${kd.name} got 20 XP as a reward!`);

	let wins = data.stats.timesWon;
	wins = Number(wins) + Number(1);
	data.stats.timesWon = wins;

	let channel = client.channels.cache.get(data.karate.battles.channel.toString());
	channel.send(embed).catch(() => {});

	reset(winner.id, loser.id, data, otherdata, firebase);
};