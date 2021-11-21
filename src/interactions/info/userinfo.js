const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'userinfo',
	description: '',

	myPermissions: ['Send Messages', 'Embed Links'],
	userPermissions: [],

	options: [
		{ name: 'member', description: 'Check the user\'s information', type: 'USER', required: false },
	],

	execute: async (interaction) => {

		const embed = new MessageEmbed();

		interaction.followUp({ embeds: [embed] });

	}
};