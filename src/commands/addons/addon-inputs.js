const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'addon-inputs',
	description: 'See the different values you can include in your responses!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	developerOnly: false,

	error: false,
	execute: async ({ interaction }) => {

		const embed = new MessageEmbed()
			.setTitle('Addon Inputs')
			.setColor('ORANGE')
			.addFields(
				{ name: 'User Cents', value: 'id: `{cents}`\nThis will be replaced with the user\'s cents.' },
				{ name: 'Register Cents', value: 'id: `{register}`\nThis will be replaced with the user\'s register balance.' },
				{ name: 'Currency Multipler', value: 'id: `{multiplier}`\nThis will be replaces wih the user\'s total flipping multipler.' },

				{ name: 'Donator Tier', value: 'id: `{donator}`\nThis will be replaced with the user\'s donator status: none, Gold tier, or Platinum tier.' },
				{ name: 'Job', value: 'id: `{job}`\nThis will be replaced with the user\'s current job.' },
				{ name: 'Total coins flipped', value: 'id: `{flipped}`\nThis will be replaced with the total number of coins flipped.' },

				{ name: 'Total minigames won', value: 'id: `{minigames}`\nThis will be replaced with the total number of minigames won.' },
			);

		interaction.followUp({ embeds: [embed] });

	},
};
