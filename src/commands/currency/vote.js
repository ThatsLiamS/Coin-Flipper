const { SlashCommandBuilder } = require('@discordjs/builders');
const dbl = require('dblapi.js');

const achievementAdd = require('./../../util/achievementAdd');

module.exports = {
	name: 'vote',
	description: 'Vote for the bot and get cents!',
	usage: '`/vote`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote for the bot and gain cents!'),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const mydbl = new dbl(
			process.env['API_TOKEN'],
			{
				webhookPort: 5000,
				webhookAuth: 'password',
			},
		);

		const hasVoted = await mydbl.hasVoted(interaction.user.id);

		if (hasVoted) {

			const date = new Date();
			const thisDate = date.getDate();

			const lastDate = userData.cooldowns.voting;
			if (lastDate == thisDate) {
				interaction.followUp({ content: 'You already claimed your voting reward today!' });
				return false;
			}

			userData.cooldowns.voting = thisDate;
			let voteAmt = 1000;
			if (userData.donator > 0) voteAmt = 1500;

			userData.currencies.cents = Number(userData.currencies.cents) + Number(voteAmt);
			userData = await achievementAdd(userData, 'toTheTop');

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);

			interaction.followUp({ content: `You voted for the bot and got \`${voteAmt}\` cents!` });
			return true;
		}

		interaction.followUp({ content: 'Vote for the bot here!\nhttps://top.gg/bot/668850031012610050/vote\n\nThen do this command again to claim your cents!' });
		return false;

	},
};