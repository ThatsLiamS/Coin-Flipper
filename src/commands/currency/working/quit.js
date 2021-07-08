const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "quit",
	description: "Quit your job for 50 cents!",
	argument: "None",
	perms: "",
	tips: "You can only use this if you have a job",
	aliases: ["quitjob", "leave", "leavejob"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.job == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have a job!" });
		userData.job = "none";

		if (userData.inv.icecube > 0) {
			let ice = userData.icecube;
			userData.inv.icecube = ice - 1;

			await firebase.doc(`/users/${message.author.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: "You quit your job! When your boss asked for the mandatory 50 cent cost, you just poured your ice cube on his head and ran! ~~totally legal~~" });
		}

		else {
			let bal = userData.currencies.cents;
			bal = Number(bal) - Number(50);
			if (bal < 0) bal = 0;

			userData.currencies.cents = bal;
			await firebase.doc(`/users/${message.author.id}`).set(userData);

			send.sendChannel({ channel: message.channel, author: message.author }, { content: `You quit your job and lost 50 cents!` });
		}
	}
};