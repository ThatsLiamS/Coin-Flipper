module.exports = {
	name: "rename",
	execute: async function(firestore, args, command, msg, discord, data, send, kd) {
		let userData = data.data();
		if (!args[1]) return send("You need to specify what to rename your karate coin!");
		let newName = args.slice(1).join(" ");
		if (newName == "NA") {
			send("You can't name your karate coin `NA` for technical reasons ||also why would you want to||");
			return;
		}
		if(newName.length > 50) {
			send("That name is too long!");
			return;
		}
		kd.name = newName.charAt(0).toUpperCase() + newName.slice(1);
		userData.karate = kd;
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You renamed your karate coin ${newName}!`);
	}
};