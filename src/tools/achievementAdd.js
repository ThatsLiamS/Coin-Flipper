const achievements = require("./constants").achievements;
module.exports = async function(userData, property, onlyReturnIfGot = false) {
	if (userData.achievements === undefined) userData.achievements = {};
	if (!userData.achievements[property]) {
		userData.achievements[property] = true;

		let mail = userData.newMail;
		if (mail === undefined) mail = [];

		let achievement = achievements.find(a => a.id == property);
		if (!achievement) return;

		mail.push(`**Notification**\nYou got the achievement ${achievement.emoji} ${achievement.name}!`);
		userData.newMail = mail;

		return userData;
	}
	if (!onlyReturnIfGot) return userData;
};