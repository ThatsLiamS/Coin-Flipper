module.exports = function checkTrading(firestore, user, userData) {
	let mData = userData.trading;
	if (mData === undefined) {
		userData.trading = {
			session: null
		};
	}
	return userData;
};