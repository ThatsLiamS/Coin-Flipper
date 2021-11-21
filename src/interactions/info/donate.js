const { MessageEmbed } = require('discord.js');

const badges = require('./../../tools/badgeEmotes');

module.exports = {
	name: 'donate',
	description: 'Get some info on Coin Flipper Gold and Platinum tiers and the cool perks they give!',

	myPermissions: ['Send Messages', 'Embed Links'],
	userPermissions: [],

	execute: async (interaction) => {

		const embed = new MessageEmbed()
			.setTitle('Coin Flipper Donator Tiers')
			.setDescription("Do you want to support the development of Coin Flipper? Consider purchasing a donator tier! Not only will you support the developers, but you'll also get cool perks worldwide!")
			.addFields(
				{ name: `__${badges.coin_gold_tier} Gold Tier__`, value: '**The gold tier is only $3/month or 1 boost in our support server!**\n» Free weekly 25,000 cents\n» Smaller cooldowns\n» 5% more cents in register\n» Exclusive gold tier badge\n» Permanent 1.5x multiplier\n» Gold Tier role in support server' },
				{ name: `__${badges.coin_platinum_tier} Platinum Tier__`, value: '**The platinum tier is $8/month or 2+ boosts in our support server!**\n» Free weekly 75,000 cents\n» 25% off everything in the shop\n» Secret teasers of new features\n» Even smaller cooldowns\n» 10% more cents in register, for a total of 25%\n» Exclusive platinum tier badge\n» Permanent 1.5x multiplier\n» Platinum tier role in support server' }
			)
			.setColor('#E0DB38')
			.setThumbnail('https://imgur.com/7TPl2Ia.png');

		interaction.followUp({ embeds: [embed] });
	}
};