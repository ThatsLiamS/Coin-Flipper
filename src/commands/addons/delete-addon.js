const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'delete-addon',
	description: 'Delete a custom or purchased addon!',
	usage: '<name>',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	options: [
		{ name: 'name', description: 'What is the addon\'s name?', type: 'STRING', required: true },
	],

	error: false,
	execute: async ({ interaction, firestore, userData }) => {
		const name = interaction.options.getString('name');
		const invalid = ['none', 'null', 'undefined', 'nan'];

		if (name.length > 50 || invalid.includes(name.toLowerCase()) || name.includes(' ')) {
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
			if (userData.addons.customaddons[path].name.toLowerCase() == name) {
				complete = true;
				userData.addons.customaddons[path] = {
					name: 'none',
					description: 'none',
					published: false,
					author: 0,
				};
			}
		}

		if (userData.online.online == true) {
			for (const path of paths) {
				if (userData.online.addonInv[path].name.toLowerCase() == name) {
					complete = true;
					userData.online.addonInv[path] = {
						name: 'none',
						description: 'none',
						published: false,
						author: 0,
					};
				}
			}
		}

		if (complete == false) {
			return interaction.followUp({ content: 'You do not have an addon of that name.' });
		}

		const embed = new MessageEmbed()
			.setTitle('Deleted addon')
			.setDescription(`You deleted the addon **${name}**!`);

		interaction.followUp({ embeds: [embed] });
		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

	},
};