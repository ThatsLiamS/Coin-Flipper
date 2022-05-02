const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'add-response',
	description: 'Add a response to a custom/server addon!',
	usage: '`/add-response <name> <response>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	options: [
		{ name: 'name', description: 'What is the addon\'s name?', type: 'STRING', required: true },
		{ name: 'response', description: 'What is the new response?', type: 'STRING', required: true },
	],

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const name = interaction.options.getString('name');
		const invalid = ['none', 'null', 'undefined', 'nan'];

		if (name.length > 50 || invalid.includes(name.toLowerCase()) || name.includes(' ')) {
			interaction.followUp({ content: 'That is an invalid addon name.' });
			return;
		}

		const response = interaction.options.getString('response');
		if (response.length > 300) {
			interaction.followUp({ content: 'Responses can not be over 300 characters long.' });
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

				complete = (userData.addons.customaddons[path].responses ?? []) || [];
				complete.push(response);

				userData.addons.customaddons[path].responses = complete;

			}
		}

		if (complete == false) {
			return interaction.followUp({ content: 'You do not have an addon of that name.' });
		}

		const embed = new MessageEmbed()
			.setTitle('Added reponse')
			.setDescription(`You added **${response}** to **${name}**!\nIt now has ${complete.length} responses.`);

		interaction.followUp({ embeds: [embed] });
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

	},
};