/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: 'links',
	description: 'Useful Coin Flipper links!',
	usage: '/links',

	cooldown: { time: 0, text: 'None (0)' },
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('links')
		.setDescription('Useful Coin Flipper links!')
		.setDMPermission(true),

	/**
	 * Useful Coin Flipper links.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Create embed full of information */
		const embed = new EmbedBuilder()
			.setTitle('Coin Flipper links')
			.setColor('#E0DB38')
			.addFields(
				{ name: '__General__', value: '[Website](https://coinflipper.liamskinner.co.uk/)\n[top.gg](https://top.gg/bot/668850031012610050)', inline: true },
				{ name: '__Support__', value: '[Support Server](https://coinflipper.liamskinner.co.uk/support)\n[Invite](https://coinflipper.liamskinner.co.uk/invite)', inline: true },
				{ name: '__Donator__', value: '[PayPal](https://paypal.me/ThatsLiamS)\n[Patreon](https://www.patreon.com/CoinFlipper)', inline: true },
			);

		/* Create row of external link buttons */
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Support Server').setURL('https://discord.gg/2je9aJynqt'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Invite').setURL('https://coinflipper.liamskinner.co.uk/invite'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Website').setURL('https://coinflipper.liamskinner.co.uk/'),
			);

		/* Returns true to enable the cooldown */
		interaction.followUp({ embeds: [embed], components: [row] });
		return true;

	},
};
