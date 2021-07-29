const achievementAdd = require(`${__dirname}/../../../tools/achievementAdd`);
const joblist = require(`${__dirname}/../../../tools/constants`).joblist;
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "work",
	description: "Work at your job and get some cents!",
	argument: "None",
	perms: "",
	cooldown: 3600,
	tips: "You can only use this if you have a job! (use `c!jobs` to get a list of jobs)",
	aliases: ["hourly"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();

		let job = userData.job;
		if (job == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a job to do work! Get a job using `c!jobs`" });
		let jobFound = joblist.find(ite => ite.name.toLowerCase() == job);

		let work = jobFound.working;

		let reason = work[Math.floor(Math.random() * work.length)];
		let randomAmt = Math.floor(Math.random() * (500 - 300 + 1)) + 400;

		if (userData.evil == true) randomAmt = Math.ceil(randomAmt * 0.5);
		if (userData.inv.clipboard > 0 && userData.evil == false) {
			randomAmt = Math.ceil(randomAmt * 1.5);
		}
		if (userData.donator > 0) randomAmt = Math.ceil(randomAmt * 1.5);
		randomAmt = Math.ceil(randomAmt * jobFound.multi);

		let bal = userData.currencies.cents;
		bal = Number(bal) + Number(randomAmt);
		let worked = userData.stats.timesWorked;
		worked = Number(worked) + Number(1);

		userData.currencies.cents = bal;
		userData.stats.timesWorked = worked;

		if (userData.stats.timesWorked >= 40) userData = await achievementAdd(userData, "nineToFive");
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You got \`${randomAmt}\` cents by ${reason}!` });
	}
};