const achievementAdd = require('./achievementAdd');
const itemlist = require('./constants').itemlist;

module.exports = async (userData) => {

	for (const item of itemlist) {
		if (userData.inv[item.id] < 1) {
			userData = await achievementAdd(userData, 'trueCollector');
		}
	}

	return userData;
};