const achievementAdd = require("./achievementAdd");
module.exports = async function(userData) {
	if (userData.inv.bronzecoin > 0
		&& userData.inv.silvercoin > 0
		&& userData.inv.goldcoin > 0
		&& userData.inv.kcoin > 0
		&& userData.karate.abilities.flip === true) {

		userData = await achievementAdd(userData, "addonMaster");
	}
	return userData;
};