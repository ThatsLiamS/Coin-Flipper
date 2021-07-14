const Discord = require('discord.js');

const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "shop",
	aliases: ["store", "items"],
	execute: async function(message) {

		const embed = new Discord.MessageEmbed()
			.setTitle("Karate Shop:")
			.setDescription("Use `c!karate buy <item>` to buy an item from here!")
			.addField("🩹 Band-aid", "Somehow a coin can wear a band-aid.\n**Restores 10 HP!**\n`Cost:` 100 cents")
			.addField("🧼 Soap", "Use soap to clean your rust\n**Restores 5 ST!**\n`Cost:` 100 cents")
			.addField("⛽ Fuel", "Use fuel to get lots of energy!\n**Restores 10 ST!**\n`Cost:` 200 cents")
			.setColor('RED');

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};