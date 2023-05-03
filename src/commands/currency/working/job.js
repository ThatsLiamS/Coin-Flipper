/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { joblist } = require('./../../../util/constants.js');
const { database } = require('./../../../util/functions.js');

/* Global variable definitions */
const levels = [0, 1, 2, 3];
const requirements = [0, 0, 15, 30];

module.exports = {
	name: 'job',
	description: 'View and claim jobs!',
	usage: '/job centre\n/job quit\n/job claim <job>',

	cooldown: { time: 5, text: '5 Seconds' },
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('job')
		.setDescription('View and claim jobs!')
		.setDMPermission(true)

		.addSubcommand(subcommand => subcommand
			.setName('centre').setDescription('Displays all the jobs you can have and the requirements!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('quit').setDescription('Leaves your current job, you may be penalised!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('claim').setDescription('Get a new job!')
			.addStringOption(option => option.setName('job').setDescription('Which job would you like:').setRequired(true)),
		),

	/**
	 * View and claim jobs.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Fetch values from the database */
		const userData = await database.getValue('users', interaction.user.id);

		if (subCommandName == 'centre') {

			/* Collection of all jobs */
			let fields = joblist.map(item => {
				return { name: `${item.emoji} ${item.name}`, value: `\`Description:\` ${item.description}\n\`Experience:\` ${item.experience}`, inline: true };
			});

			if (userData.stats.worked < 30) fields = fields.slice(0, 6);
			if (userData.stats.worked < 15) fields = fields.slice(0, 3);

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
			if (userData.stats.job != 'none' && userData.stats.job != '') {
				interaction.followUp({ content: 'You have to leave your current job first!\nUse `/job quit` to leave.' });
				return false;
			}

			/* Locate the selected job */
			const TargetJob = interaction.options.getString('job').toLowerCase();
			const jobFound = joblist.find(job => job.name.toLowerCase() == TargetJob);
			if (!jobFound || jobFound == undefined || jobFound == null) {
				interaction.followUp({ content: 'That is not a valid job! Use `/job centre` to view the list' });
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

			if (userData.stats.worked < requirements[levels.indexOf(jobFound.level)] || !conditional) {
				interaction.followUp({ content: 'You do not meet the requirements for that job!' });
				return false;
			}

			/* Set the new job in the database */
			userData.stats.job = jobFound.name.toLowerCase();
			interaction.followUp({ content: `You became a ${jobFound.emoji} ${jobFound.name}! do\`/work\` to get to work at your new job!` });
		}

		if (subCommandName == 'quit') {

			/* Do they have a job */
			if (userData.stats.job == undefined || (userData.stats.job == 'none' && userData.stats.job == '')) {
				interaction.followUp({ content: 'You don\'t have a job!' });
				return false;
			}

			/* Set the new value ('') in the database */
			userData.stats.job = '';
			if (!(userData.items.icecube > 0)) {
				userData.stats.balance = (userData.stats.balance > 50) ? Number(userData.stats.balance) - 50 : 0;
			}

			interaction.followUp({ content: 'You have successfully quit your job.' });
		}

		/* Sets the new values in the database */
		await database.setValue('users', interaction.user.id, userData);
		return true;

	},
};
