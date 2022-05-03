const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'rename-addon',
	description: 'Change the name of your custom addon!',
	usage: '`/rename-addon <old> <new>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('rename-addon')
		.setDescription('Change the name of a custom addon!')

		.addStringOption(option => option
			.setName('old').setDescription('What is the addon\'s name?').setRequired(true),
		)
		.addStringOption(option => option
			.setName('new').setDescription('What do you want the new name to be?').setRequired(true),
		),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const oldName = interaction.options.getString('old');
		const newName = interaction.options.getString('new');

		const invalid = ['none', 'null', 'undefined', 'nan'];
		if (oldName.length > 50 || invalid.includes(oldName.toLowerCase()) || oldName.includes(' ')) {
			interaction.followUp({ content: 'That is an invalid addon name.' });
			return;
		}
		if (newName.length > 50 || invalid.includes(newName.toLowerCase()) || newName.includes(' ')) {
			interaction.followUp({ content: 'That is an invalid addon name.' });
			return;
		}

		const paths = [
			'first',
			'second',
			'third',
		];

		let complete = false;
		for (const path of paths) {
			if (userData.addons.customaddons[path].name.toLowerCase() == oldName) {
				complete = true;
				userData.addons.customaddons[path].name = newName;
			}
		}

		if (complete == false) {
			return interaction.followUp({ content: 'You do not have an addon of that name.' });
		}

		const embed = new MessageEmbed()
			.setTitle('Renamed addon')
			.setDescription(`You renamed ${oldName} to **${newName}**!`);

		interaction.followUp({ embeds: [embed] });
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

	},
};