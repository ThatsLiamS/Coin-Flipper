const { achievements } = require('./constants');

module.exports = (userData, prop) => {

	if (userData.achievements == undefined) userData.achievements = {};

	if (!userData.achievements[prop]) {
		userData.achievements[prop] = true;

		let mail = userData.newMail;
		if (mail == undefined) mail = [];

		const achievement = achievements.find(a => a.id == prop);
		if (!achievement) return userData;

		mail.push(`**Notification**\nYou got the achievement ${achievement.emoji} ${achievement.name}!`);
		userData.newMail = mail;
	}

	return userData;
};
