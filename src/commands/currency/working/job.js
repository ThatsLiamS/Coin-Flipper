/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { joblist } = require('./../../../util/constants');

/* Global variable definitions */
const levels = [0, 1, 2, 3];
const requirements = [0, 0, 15, 30];

module.exports = {
	name: 'job',
	description: 'View and claim jobs!',
	usage: '`/job centre`\n`/job quit`\n`/job claim <job>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('job')
		.setDescription('View and claim jobs!')

		.addSubcommand(subcommand => subcommand
			.setName('centre')
			.setDescription('Displays all the jobs you can have and the requirements!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('quit')
			.setDescription('Leaves your current job, you may be penalised!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('claim')
			.setDescription('Get a new job!')
			.addStringOption(option => option.setName('job').setDescription('Which job would you like:').setRequired(true)),
		),

	error: false,

	/**
	 * View and claim jobs.
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 * 
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		if (subCommandName == 'centre') {

			/* Collection of all jobs */
			let fields = joblist.map(item => {
				return { name: `${item.emoji} ${item.name}`, value: `\`Description:\` ${item.description}\n\`Experience:\` ${item.experience}`, inline: true };
			});

			if (userData.stats.timesWorked < 30) fields = fields.slice(0, 6);
			if (userData.stats.timesWorked < 15) fields = fields.slice(0, 3);

			const embed = new EmbedBuilder()
				.setTitle('Jobs:')
				.setColor('Blue')
				.addFields(fields)
				.setFooter({ text: 'Work more to unlock new jobs!' });

			/* Returns true to enable cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'claim') {

			/* Do they already have a job */
			if (userData.job != 'none') {
				interaction.followUp({ content: 'You have to leave your current job first!\nUse `/job quit` to leave.' });
				return false;
			}

			/* Locate the selected job */
			const TargetJob = interaction.options.getString('job').toLowerCase();
			const jobFound = joblist.find(job => job.name.toLowerCase() == TargetJob);
			if (!jobFound || jobFound == undefined || jobFound == null) {
				interaction.followUp({ content: 'That is not a valid job!' });
				return false;
			}

			/* Do they meet the requirements for the job */
			let conditional = true;
			if (jobFound.req.startsWith('special')) { if (!userData?.achievements?.penPals === undefined) conditional = false; }
			else {
				const arg = jobFound.req.split('|');
				const irg = arg[0].split('.');

				if (arg[1] == '>') conditional = (userData[irg[0]][irg[1]] > arg[2]);
			}

			if (userData.stats.timesWorked < requirements[levels.indexOf(jobFound.level)] || !conditional) {
				interaction.followUp({ content: 'You do not meet the requirements for that job!' });
				return false;
			}

			/* Set the new job in the database */
			userData.job = jobFound.name.toLowerCase();
			interaction.followUp({ content: `You became a ${jobFound.emoji} ${jobFound.name}! do\`/work\` to get to work at your new job!` });

			/* returns true to enable the cooldown */
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			return true;
		}

		if (subCommandName == 'quit') {

			/* Do they have a job */
			if (userData.job == undefined || userData.job == 'none') {
				interaction.followUp({ content: 'You don\'t have a job!' });
				return false;
			}

			/* Set the new value ('none') in the database */
			userData.job = 'none';
			userData.currencies.cents = userData.currencies.cents > 50 ? Number(userData.currencies.cents) - 50 : 0;

			interaction.followUp({ content: 'You have successfully quit your job.' });

			/* returns true to enable the cooldown */
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			return true;
		}

		return false;
	},
};
