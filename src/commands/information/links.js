const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
	name: 'links',
	description: 'Useful Coin Flipper links!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('links')
		.setDescription('Useful Coin Flipper links!'),

	error: false,
	execute: async ({ interaction }) => {

		const embed = new MessageEmbed()
			.setTitle('Coin Flipper links')
			.setColor('#E0DB38')
			.addFields(
				{ name: '__General__', value: '[Website](https://coinflipper.pages.dev)\n[top.gg](https://top.gg/bot/668850031012610050)', inline: true },
				{ name: '__Support__', value: '[Support Server](https://discord.gg/2je9aJynqt)\n[Invite](https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands)', inline: true },
				{ name: '__Donator__', value: '[PayPal](https://paypal.me/ThatsLiamS)\n[Patreon](https://www.patreon.com/CoinFlipper)', inline: true },
			);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('LINK').setLabel('Support Server').setURL('https://discord.gg/2je9aJynqt'),
				new MessageButton()
					.setStyle('LINK').setLabel('Invite').setURL('https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands'),
				new MessageButton()
					.setStyle('LINK').setLabel('Website').setURL('https://coinflipper.pages.dev'),
			);

		interaction.followUp({ embeds: [embed], components: [row] });

	},
};
