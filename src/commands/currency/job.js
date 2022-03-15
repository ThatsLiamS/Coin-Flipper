const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { joblist } = require(`${__dirname}/../../../tools/constants`)

module.exports = {
	name: 'job',
	description: 'View and claim jobs!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: true,

	data: new SlashCommandBuilder()
		.setName('job')
		.setDescription('View and claim jobs!')

		.addSubcommand(subcommand => subcommand
			.setName('centre')
			.setDescription('Displays all the jobs you can have and the requirements!')
		)

		.addSubcommand(subcommand => subcommand
			.setName('quit')
			.setDescription('Leaves your current job, you may be penalised!')
		)

		.addSubcommand(subcommand => subcommand
			.setName('')
			.setDescription('Get a new job!')
			.addStringOption(option => option.setName('job').setDescription('Which job would you like:').setRequired(true))
		),

	error: false,
	execute: async ({ interaction, client, firestore, userData }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		if (subCommandName == 'centre') {

			let fields = joblist.map(item => {
				return { name: `${item.emoji} ${item.name}`, value: `\`Description:\` ${item.description}\n\`Experience:\` ${item.experience}`, inline: true };
			});

			if (userData.stats.timesWorked < 30) fields = fields.slice(0, 6);
			if(userData.stats.timesWorked < 15) fields = fields.slice(0, 3);

			const embed = new MessageEmbed()
				.setTitle('Jobs:')
				.setColor('BLUE')
				.addFields(fields)
				.setFooter({ text: 'Work more to unlock new jobs!' })

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == '') {

			if (userData.job != 'none') {
				interaction.followUp({ content: 'You have to leave your current job first!\nUse `/job quit` to leave.' });
				return false;
			}

			const TargetJob = interaction.options.getString('job').toLowerCase();
			const jobFound = joblist.find(item => item.name.toLowerCase() == TargetJob);
			if (!jobFound || jobFound == undefined || jobFound == null) {
				interaction.followUp({ content: 'That is not a valid job!' });
				return false;
			}

			return true;
		}

		if (subCommandName == 'quit') {

			if (userData.job == undefined || userData.job == 'none') {
				interaction.followUp({ content: 'You don\'t have a job!' });
				return false;
			}

			userData.job == 'none';
			userData.currencies.cents = userData.currencies.cents > 50 ? userData.currencies.cents - 50 : 0;

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			return true;
		}

		return false;
	},
};
