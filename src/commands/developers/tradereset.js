module.exports = {
	name: "tradereset",
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let user = message.mentions.users.first();

		let otherdata = await firebase.doc(`/users/${user.id}`).get();
		let otherData = otherdata.data();

		userData.trading.session = null;
		otherData.trading.session = null;

		await firebase.doc(`/users/${message.author.id}`).set(userData);
		await firebase.doc(`/users/${user.id}`).set(otherData);

	}
};