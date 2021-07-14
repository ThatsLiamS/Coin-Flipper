const turn = require(`${__dirname}/turn`);

module.exports = async function start(user, other, data, otherdata, firebase, client) {

	let kd = data.karate;
	let ok = otherdata.karate;

	kd.battles.in_battle = true;
	ok.battles.in_battle = true;

	let channel = client.channels.cache.get(kd.battles.channel.toString());
	channel.send(`The battle has started! <@${other.id}> will go first!`, channel).catch(() => {});

	let hp1 = Math.floor(5 * kd.level);
	let hp2 = Math.floor(5 * ok.level);
	let st1 = Math.floor(3.5 * kd.level);
	let st2 = Math.floor(3.5 * ok.level);

	kd.battles.hp = hp1;
	kd.battles.mhp = hp1;
	kd.battles.st = st1;
	kd.battles.mst = st1;
	ok.battles.hp = hp2;
	ok.battles.mhp = hp2;
	ok.battles.st = st2;
	ok.battles.mst = st2;
	data.karate = kd;
	otherdata.karate = ok;

	await firebase.doc(`/users/${user.id}`).set(data);
	await firebase.doc(`/users/${other.id}`).set(otherdata);

	turn(user.id, other.id, data, firebase, client);
};