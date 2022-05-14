const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { readdirSync } = require('fs');

module.exports = {
	name: 'devhelp',
	description: 'Get a list of the developer commands',
	usage: '`/devhelp`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: true,

	data: new SlashCommandBuilder()
		.setName('devhelp')
		.setDescription('Get a list of the developer commands'),

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