const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
	name: 'donate',
	description: 'Get loads of information about our donator tiers!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	developerOnly: false,

	error: false,
	execute: async ({ interaction }) => {

		const embed = new MessageEmbed()
			.setTitle('Coin Flipper donator tiers')
			.setColor('#E0DB38')
			.setThumbnail('https://imgur.com/7TPl2Ia.png')
			.setDescription('Are you enjoying Coin Flipper? Consider supporting us by purchasing one of our donator tiers! Not only will you help support the developers, you will also get loads of cool worldwide perks!')
			.addFields(
				{ name: '<:coin_goldtier:832295667795624027> Gold Tier', value: '» Free weekly 25,000 cents\n» Access to private text and voice channels\n» Smaller cooldowns\n» 5% more cents go in register (for a total of 15%)\n» Exclusive donator badge\nPrice: £5/month', inline: false },
				{ name: '<:coin_platinumtier:832295735445553152> Platinum Tier', value: '» Free weekly 75,000 cents\n» 25% off everything in the shop\n» Access to private text and voice channels\n» Even smaller cooldowns\n» 15% more cents go in register (for a total of 25%)\n» Very exclusive donator badge\n» Secret teasers of new features\nPrice: £10/month', inline: false },
			);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('LINK').setLabel('PayPal').setURL('https://paypal.me/ThatsLiamS'),
				new MessageButton()
					.setStyle('LINK').setLabel('Patreon').setURL('https://www.patreon.com/CoinFlipper'),
			);

		interaction.followUp({ embeds: [embed], components: [row] });

	},
};