const profanityCheck = require("../../../tools/profanities").profanityCheck;

module.exports = {
	name: "setbio",
	description: "Set a message that will be seen on your balance!",
	argument: "What you want to set it to",
	perms: "",
	tips: "",
	aliases: ["bio", "setbal", "setmessage"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		if (userData.inv.paper === undefined || userData.inv.paper == 0) return send("You need to have a piece of paper to set your bio!\nBuy one in the 1000 servers shop! (`c!limited`)");
		if (!args[0]) return send("You have to specify the bio you want!");
		let bio = args.slice(0).join(" ");
		bio = bio.charAt(0).toUpperCase() + bio.slice(1);
		if (profanityCheck(bio) == true) return send("You can't have profanities!");
		if (bio.length > 150) return send("That bio is too long!");
		userData.stats.bio = bio;
		send(`You set your bio to: \`${bio}\``);
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
	}
};