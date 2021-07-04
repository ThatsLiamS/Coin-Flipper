const joblist = require("../../../tools/constants").joblist;
module.exports = {
	name: "job",
	description: "Get a job - but only if you meet the requirements!",
	argument: "The job you want to get",
	perms: "",
	tips: "You can only use this if you don't have a job",
	aliases: ["getjob", "claimjob", "hire", "hirejob", "apply"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		let job = userData.job;
		if (job != "none") return send("You already have a job! (Use c!quit to quit)");
		let jobFound = joblist.find(ite => ite.name.toLowerCase() == args.slice(0).join(" "));
		if (!jobFound) return send("That's not a valid job! (use `c!jobs`)");
		let levels = [0, 1, 2, 3];
		let reqs = [0, 0, 15, 30];
		if (userData.stats.timesWorked < reqs[levels.indexOf(jobFound.level)]) return send(`You can't get that job yet! You have to work \`${reqs[levels.indexOf(jobFound.level)] - userData.stats.timesWorked}\` more times!`);
		let conditional = true;
		if (jobFound.req.startsWith("special")) {
			if (!userData.achievements) conditional = false;
			if (!userData.achievements.penPals === undefined) conditional = false;
		}
		else {
			let arg = jobFound.req.split("|");
			let irg = arg[0].split(".");
			let property = userData[irg[0]][irg[1]];
			if (arg[1] == ">") conditional = (property > arg[2]);
		}
		let jobName = `${jobFound.emoji} ${jobFound.name}`;
		if (!conditional) return send("Sorry, you don't have enough experience to get that job! (use `c!jobs`)");
		userData.job = jobFound.name.toLowerCase();
		await firestore.doc(`/users/${msg.author.id}`).set(userData);
		send(`You became a ${jobName}! Use \`c!work\` to work at your new job!`);
	}
};