const Discord = require('discord.js');

const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: `donate`,
	description: "Get some info on Coin Flipper Gold and Platinum tiers and the cool perks they give!",
	argument: "None",
	perms: "Embed Links",
	tips: "",
	aliases: ["donators", "boost", "boosts", "perks", "perk", "tiers", "tier", "gold", "platinum"],
	execute: async function(message) {

		const embed = new Discord.MessageEmbed()
			.setTitle("Coin Flipper Donator Tiers")
			.setDescription("Do you want to support the development of Coin Flipper? Consider purchasing a donator tier! Not only will you support the devs, but you'll also get cool perks worldwide!")
			.addField("<:coin_goldtier:832295667795624027> Gold Tier", "The gold tier is only $3/month or 1 boost in our support server!\n» Free weekly 25,000 cents\n» Smaller cooldowns\n» 5% more cents in register\n» Exclusive gold tier badge\n» Permanent 1.5x multiplier\n» Gold Tier role in support server\n» Shout out in the support server")
			.addField("<:coin_platinumtier:832295735445553152> Platinum Tier", "The platinum tier is $8/month or 2+ boosts in our support server!\n» Free weekly 75,000 cents\n» 25% off everything in the shop\n» Secret teasers of new features\n» Even smaller cooldowns\n» 10% more cents in register, for a total of 25%\n» Exclusive platinum tier badge\n» Permanent 1.5x multiplier\n» Platinum tier role in support server\n» Custom shout out in the support server")
			.setColor("#e0db38")
			.setThumbnail("https://imgur.com/7TPl2Ia.png");

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};