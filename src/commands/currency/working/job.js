const joblist = require(`${__dirname}/../../../tools/constants`).joblist;
const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "job",
	description: "Get a job - but only if you meet the requirements!",
	argument: "The job you want to get",
	perms: "",
	tips: "You can only use this if you don't have a job",
	aliases: ["getjob", "claimjob", "hire", "hirejob", "apply"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		let job = userData.job;
		if (job != "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already have a job! (Use c!quit to quit)" });

		let jobFound = joblist.find(ite => ite.name.toLowerCase() == args.slice(0).join(" "));
		if (!jobFound) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid job! (use `c!jobs`)" });

		let levels = [0, 1, 2, 3];
		let reqs = [0, 0, 15, 30];

		if (userData.stats.timesWorked < reqs[levels.indexOf(jobFound.level)]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: `You can't get that job yet! You have to work \`${reqs[levels.indexOf(jobFound.level)] - userData.stats.timesWorked}\` more times!` });
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

		if (!conditional) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you don't have enough experience to get that job! (use `c!jobs`)" });
		userData.job = jobFound.name.toLowerCase();
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You became a ${jobName}! Use \`c!work\` to work at your new job!` });

	}
};