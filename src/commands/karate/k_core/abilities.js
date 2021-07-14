const Discord = require('discord.js');

const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "abilities",
	aliases: ["abilitylist", "abilitieslist"],
	execute: async function(message) {

		const embed = new Discord.MessageEmbed()
			.setTitle("Abilities")
			.setDescription("Use `c!karate gain <ability>` to gain one of these abilities!")
			.addField("Flip", "A simple ability where the coin flips\n**Level 1 required**")
			.addField("Spin", "A prickling ability where the coin spins very fast on the floor\n**Level 2 required**")
			.addField("Slide", "A fast ability where the coin slides across the floor, hitting the opponent\n**Level 4 required**")
			.addField("Dive", "A complex ability where the coin leaps into the air and dives down for a strong attack\n**Level 6 required**")
			.addField("Swipe", "A precise ability where the coin aims just right to fly through and crash into its opponent\n**Level 10 required**")
			.addField("Slice", "A complicated but rewarding ability, where the coin leaps into the air, aims to its opponent, and dives while slicing its opponent\n**Level 16 required**")
			.setColor('RED');

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};