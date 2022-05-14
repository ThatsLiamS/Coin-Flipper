const { SlashCommandBuilder } = require('@discordjs/builders');

const achievementAdd = require('./../../../util/achievementAdd');
const { joblist } = require('./../../../util/constants');

module.exports = {
	name: 'work',
	description: 'Work at your job and collect your paycheck!',
	usage: '`/work`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work at your job and collect your paycheck!'),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const job = userData.job;
		if (job == 'none') {
			interaction.followUp({ content: 'You need a job to do work! Get a job using `/job claim`' });
			return;
		}

		const jobFound = joblist.find(ite => ite.name.toLowerCase() == job);
		const work = jobFound.working;

		const reason = work[Math.floor(Math.random() * work.length)];
		let randomAmt = Math.floor(Math.random() * (500 - 300 + 1)) + 400;

		if (userData.evil == true) randomAmt = Math.ceil(randomAmt * 0.5);
		if (userData.inv.clipboard > 0 && userData.evil == false) randomAmt = Math.ceil(randomAmt * 1.5);
		if (userData.donator > 0) randomAmt = Math.ceil(randomAmt * 1.5);

		randomAmt = Math.ceil(randomAmt * jobFound.multi);

		userData.currencies.cents = Number(userData.currencies.cents) + Number(randomAmt);
		userData.stats.timesWorked = Number(userData.stats.timesWorked) + Number(1);

		if (userData.stats.timesWorked >= 40) userData = await achievementAdd(userData, 'nineToFive');
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		interaction.followUp({ content: `You got \`${randomAmt}\` cents by ${reason}!` });
		return true;

	},
};