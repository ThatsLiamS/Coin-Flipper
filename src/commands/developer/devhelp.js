const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
	name: 'devhelp',
	description: 'Get a list of the developer commands',
	usage: '',

	permissions: [],
	ownerOnly: false,
	developerOnly: true,

	error: false,
	execute: async ({ interaction }) => {

		let description = '';
		const commandFiles = readdirSync(`${__dirname}/../developer`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`${__dirname}/../developer/${file}`);
			description = description + `\`/${command.name} ${command.usage}\` ${command.description}\n`;
		}

		const embed = new MessageEmbed()
			.setTitle('Developer Commands')
			.setDescription(description)
			.setColor('#D3D3D3');

		interaction.followUp({ embeds: [embed] });

	},
};