const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'addon',
	description: 'Collection of user-based, custom addons.',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('addon')
		.setDescription('Collection of user-based, custom addons.')

		.addSubcommand(subcommand => subcommand
			.setName('view')
			.setDescription('View an addon and it\'s responses!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('create')
			.setDescription('Create a new custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('rename')
			.setDescription('Rename a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true))
			.addStringOption(option => option.setName('new_name').setDescription('What do you want the new name to be?').setRequired(true)),
		)
		.addSubcommand(subcommand => subcommand
			.setName('delete')
			.setDescription('Delete a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('setcost')
			.setDescription('Set the price of a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true))
			.addIntegerOption(option => option.setName('cost').setDescription('How much for?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('setdescription')
			.setDescription('Set the description of a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true))
			.addStringOption(option => option.setName('description').setDescription('What is the description?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('addresponse')
			.setDescription('Add a new response to a custom addon')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true))
			.addStringOption(option => option.setName('response').setDescription('What do you want the response to be?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('deleteresponse')
			.setDescription('Delete a response of a custom addon')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true))
			.addIntegerOption(option => option.setName('response').setDescription('Which response number?').setRequired(true)),
		),

	error: true,
	execute: async ({ interaction, firestore, userData }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		const name = interaction.options.getString('name');
		if (name.length > 50 || ['none', 'null', 'undefined', 'nan'].includes(name.toLowerCase()) || name.includes(' ')) {
			return interaction.followUp({ content: 'That is an invalid addon name.' });
		}

		let pathway = null;
		for (const path of ['first', 'second', 'third']) {
			if (userData.addons.customaddons[path].name == 'hello2') pathway = userData.addons.customaddons[path];
		}
		if (!pathway && subCommandName !== 'create') {
			interaction.followUp({ content: 'That is not a valid addon, use `/addon create` to create a new one.' });
			return false;
		}

		const embed = new MessageEmbed();

		if (subCommandName == 'view') {
		}

		if (subCommandName == 'create') {
		}

		if (subCommandName == 'rename') {
		}

		if (subCommandName == 'delete') {
		}

		if (subCommandName == 'setcost') {
		}

		if (subCommandName == 'setdescription') {
		}

		if (subCommandName == 'addresponse') {
		}

		if (subCommandName == 'deleteresponse') {
		}

		interaction.followUp({ embeds: [embed] });

		await firestore.doc(`/users/${interaction.user.id}`).set(userData);
		return true;
	},
};
