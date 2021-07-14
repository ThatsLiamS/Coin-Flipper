module.exports = async function reset(user, other, data, otherdata, firebase) {

	let kd = data.karate;
	let ok = otherdata.karate;

	kd.battles.choosing = false;
	ok.battles.choosing = false;
	kd.battles.in_battle = false;
	ok.battles.in_battle = false;

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

	kd.battles.askedBy = 0;
	kd.battles.askedTo = 0;
	ok.battles.askedBy = 0;
	ok.battles.askedTo = 0;
	kd.battles.against = 0;
	ok.battles.against = 0;
	data.karate = kd;
	otherdata.karate = ok;

	await firebase.doc(`/users/${user}`).set(data);
	await firebase.doc(`/users/${other}`).set(otherdata);
};