module.exports = function checkMining(firestore, user, userData) {
	let mData = userData.mining;
	if (mData === undefined) {
		userData.mining = {
			pickaxe: "standard",
			easier: 0,
			rock: 0,
			sapphire: 0,
			ruby: 0,
			opal: 0,
			diamond: 0,
			banana: 0,
			steel: 0,
			infinitystone: 0
		};
	}
	return userData;
};