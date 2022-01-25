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
		{ name: 'name', description: 'What is the addon\'s name?', type: 'STRING', required: true },
		{ name: 'description', description: 'What is the addon\'s description?', type: 'INTEGER', required: true },
	],

	error: false,
	execute: async ({ interaction, firestore, userData }) => {
		const name = interaction.options.getString('name');
		const invalid = ['none', 'null', 'undefined', 'nan'];

		if (name.length > 50 || invalid.includes(name.toLowerCase()) || name.includes(' ')) {
			interaction.followUp({ content: 'That is an invalid addon name.' });
			return;
		}

		const description = interaction.options.getInteger('description');
		if (description.length > 300) {
			interaction.followUp({ content: 'Your addon description can not be over 300 characters/' });
			return;
		}

		const paths = [
			'first',
			'second',
			'third',
		];

		let complete = false;
		for (const path of paths) {
			if (userData.addons.customaddons[path].name.toLowerCase() == name) {
				complete = true;
				userData.addons.customaddons[path].description = description;
			}
		}

		if (complete == false) {
			return interaction.followUp({ content: 'You do not have an addon of that name.' });
		}

		const embed = new MessageEmbed()
			.setTitle('Updated Description')
			.setDescription(`You set the description of **${name}** to:\n${description}`);

		interaction.followUp({ embeds: [embed] });
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

	},
};