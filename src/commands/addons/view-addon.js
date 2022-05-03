const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'view-addon',
	description: 'View a custom addon!',
	usage: '`/view-addon <name>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('view-addon')
		.setDescription('View a custom addon!')

		.addStringOption(option => option
			.setName('name').setDescription('What is the addon\'s name?').setRequired(true),
		),

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

		const embed = new MessageEmbed()
			.setTitle(`Addon ${addon.name}`)
			.setDescription(`Description: ${addon.description}\nCost: ${addon.cost} cents.`)
			.setColor('GREEN')
			.addFields(
				{ name: 'Responses', description: `${(addon.responses ?? []).length} responses`, inline: true },
				{ name: 'Published', description: `${addon.published ? 'yes' : 'no'}`, inline: true },
			)
			.setFooter({ text: 'To view the responses, do /view-responses <addon>' });

		interaction.followUp({ embeds: [embed] });

	},
};
