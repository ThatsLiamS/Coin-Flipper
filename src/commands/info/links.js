const Discord = require('discord.js');

const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: `links`,
	description: "Get some helpful links for the bot!",
	argument: "None",
	perms: "Embed Links",
	tips: "",
	aliases: ["website", "web", "link", "channel", "youtube", "yt", "topgg", "legal", "support", "server", "servers", "invite"],
	execute: async function(message) {

		const embed = new Discord.MessageEmbed()
			.setTitle(`Coin Flipper Links`)
			.setColor(`#CD7F32`)
			.addFields(
				{ name: `__Website__`, value: `[Click Here](https://coinflipper.pages.dev/)`, inline: true },
				{ name: `__YouTube__`, value:`[Click Here](https://www.youtube.com/channel/UCwRkbPsvDGIfpllKNjgd8xA)`, inline: true },
				{ name: `__Support Server__`, value:`[Click Here](https://discord.gg/yD5PDYNXcP)`, inline: true },
				{ name: `__Invite__`, value:`[Click Here](https://discord.com/oauth2/authorize?client_id=668850031012610050&scope=bot&permissions=388160)`, inline: true },
				{ name: `__Terms of Service__`, value:`[Click Here](https://docs.google.com/document/d/1EiK8197uLgdKiE4bhvT2BRQKpKmxmXMtwwKg3OA90l8/edit?usp=sharing)`, inline: true },
				{ name: `__Privacy Policy__`, value:`[Click Here](https://docs.google.com/document/d/1TmIRFgKyp9ynlduYRjjEp77PCBTmYUzipcgFaDSTmns)`, inline: true }
			);

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};