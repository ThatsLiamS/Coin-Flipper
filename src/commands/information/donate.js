const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const { emojis } = require('./../../util/constants');


module.exports = {
	name: 'donate',
	description: 'Information about our donator tiers!',
	usage: '/donate',

	cooldown: {
		time: 0,
		text: 'None (0)',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Information about our donator tiers!')
		.setDMPermission(true),

	/**
	 * Information about our donator tiers.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Create embed full of information */
		const embed = new EmbedBuilder()
			.setTitle('Coin Flipper donator tiers')
			.setColor('#E0DB38')
			.setThumbnail('https://imgur.com/7TPl2Ia.png')
			.setDescription('Are you enjoying Coin Flipper? Consider supporting us by purchasing one of our donator tiers! Not only will you help support the developers, you will also get loads of cool worldwide perks!')
			.addFields(
				{ name: `${emojis.coin_gold_tier} Gold Tier`, value: '» Free weekly 25,000 cents\n» Access to private text and voice channels\n» 5% more cents go in register (for a total of 15%)\n» Exclusive donator badge\nPrice: £5/month', inline: false },
				{ name: `${emojis.coin_platinum_tier} Platinum Tier`, value: '» Free weekly 75,000 cents\n» 25% off everything in the shop\n» Access to private text and voice channels\n» 15% more cents go in register (for a total of 25%)\n» Very exclusive donator badge\n» Secret teasers of new features\nPrice: £10/month', inline: false },
			);

		/* Create row of link buttons */
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('PayPal')
					.setURL('https://paypal.me/ThatsLiamS'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Patreon')
					.setURL('https://www.patreon.com/CoinFlipper'),
			);

		/* Returns true to enable the cooldown */
		interaction.followUp({
			embeds: [embed],
			components: [row],
		});

		return true;
	},
};
