const achievementAdd = require('./achievementAdd');
const itemlist = require('./constants').itemlist;

module.exports = (userData) => {

	for (const item of itemlist) {
		if (userData.inv[item.id] < 1) {
			userData = achievementAdd(userData, 'trueCollector');
		}
	}

	return userData;
};