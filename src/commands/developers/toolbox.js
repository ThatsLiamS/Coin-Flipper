module.exports = {
	name: "toolbox",
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (msg.author.id != 821512062999199795) return send("Only the owner can use this >:)");
		let user = msg.mentions.users.first();
		if (user) {
			let Data = await firestore.doc(`/users/${user.id}`).get();
			let userData = Data.data();
			let bool = (args[0] == "true");
			userData.inv.toolbox = bool;
			await firestore.doc(`/users/${user.id}`).set(userData);
		}
		else {
			let userData = data.data();
			let bool = (args[0] == "true");
			userData.inv.toolbox = bool;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
		}
	}
};