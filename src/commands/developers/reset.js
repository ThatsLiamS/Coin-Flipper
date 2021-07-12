const reset = require(`${__dirname}/../karate/k_tools/reset`);

module.exports = {
	name: "reset",
	developerOnly: true,
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();

		let user = message.mentions.users.first();
		let otherdata = await firebase.doc(`/users/${user.id}`).get();
		let otherData = otherdata.data();

		reset(message.author.id, user.id, userData, otherData, firebase);
	}
};