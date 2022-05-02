const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'view-responses',
	description: 'View the responses of a custom addon!',
	usage: '`/view-responses <name> [page number]`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	options: [
		{ name: 'name', description: 'What is the addon\'s name?', type: 'STRING', required: true },
		{ name: 'page', description: 'Page number, default is 1.', type: 'INTEGER', required: true },
	],

	error: false,
	execute: async ({ interaction, userData }) => {

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

		let addon = false;
		for (const path of paths) {
			if (userData.addons.customaddons[path].name.toLowerCase() == name) {
				addon = userData.addons.customaddons[path];
			}
		}

		if (addon == false) {
			return interaction.followUp({ content: 'You do not have an addon of that name.' });
		}

		const pages = [];
		const pageData = [];

		for (let x = 0; x < addon.responses.length; x += 10) pageData.push(addon.responses.slice(x, x + 10));

		for (let x = 0; x < pageData.length; x++) {
			const embed = new MessageEmbed()
				.setColor('GREEN')
				.setTitle(`${name} Responses`)
				.setFooter({ text: 'To view addon data, do /view-addon' });

			let data = '';
			for (let y = 0; y < pageData[x].length; y++) {
				data += `\`${(pages.length || 0) + (y + 1)}.\` ${pageData[x][y]}`;
			}
			embed.addField('Responses', data);

			pages.push(embed);
		}

		const pageNumber = Number(interaction.options.getInteger('page') || 1);
		const embed = pages[pageNumber - 1] ? pages[pageNumber - 1] : pages[0];
		interaction.followUp({ embeds: [embed] });

	},
};
