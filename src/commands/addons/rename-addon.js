const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'set-cost',
	description: 'Set the price of your custom addon!',
	usage: '<name> <cost>',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	options: [
		{ name: 'current-name', description: 'What is the addon\'s name?', type: 'STRING', required: true },
		{ name: 'new-name', description: 'What should it be renamed to?', type: 'INTEGER', required: true },
	],

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const oldName = interaction.options.getString('current-name');
		const newName = interaction.options.getString('new-name');

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