/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: 'links',
	description: 'Useful Coin Flipper links!',
	usage: '`/links`',

	permissions: [],
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('links')
		.setDescription('Useful Coin Flipper links!')
		.setDMPermission(true),

	error: false,
	defer: true,

	/**
	 * Useful Coin Flipper links.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Create embed full of information */
		const embed = new EmbedBuilder()
			.setTitle('Coin Flipper links')
			.setColor('#E0DB38')
			.addFields(
				{ name: '__General__', value: '[Website](https://coinflipper.pages.dev)\n[top.gg](https://top.gg/bot/668850031012610050)', inline: true },
				{ name: '__Support__', value: '[Support Server](https://discord.gg/2je9aJynqt)\n[Invite](https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands)', inline: true },
				{ name: '__Donator__', value: '[PayPal](https://paypal.me/ThatsLiamS)\n[Patreon](https://www.patreon.com/CoinFlipper)', inline: true },
			);

		/* Create row of link buttons */
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Support Server').setURL('https://discord.gg/2je9aJynqt'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Invite').setURL('https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Website').setURL('https://coinflipper.pages.dev'),
			);

		/* Returns true to enable the cooldown */
		interaction.followUp({ embeds: [embed], components: [row] });
		return true;

	},
};
