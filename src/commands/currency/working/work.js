const achievementAdd = require("../../../tools/achievementAdd");
const joblist = require("../../../tools/constants").joblist;
module.exports = {
	name: "work",
	description: "Work at your job and get some cents!",
	argument: "None",
	perms: "",
	cooldowny: "1 hour",
	tips: "You can only use this if you have a job! (use `c!jobs` to get a list of jobs)",
	aliases: ["hourly"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let job = userData.job;
		if (job == "none") return send("You need a job to do work! Get a job using `c!jobs`");
		let jobFound = joblist.find(ite => ite.name.toLowerCase() == job);
		let date = new Date();
		let thisHour = date.getHours();
		let lastHour = userData.cooldowns.work;
		if (thisHour == lastHour) return send("You can only work once per hour!");
		userData.cooldowns.work = thisHour;
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
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You got \`${randomAmt}\` cents by ${reason}!`);
	}
};