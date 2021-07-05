const Discord = require("discord.js");
const send = require(`${__dirname}/../tools/send`);
const monthTranslating = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

module.exports = {
	name: "ready",
	once: true,
	execute: async function(client) {

		const serverCount = client.guilds.cache.size;
		const users = await client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

		const time = new Date();
		const startTime = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${monthTranslating[time.getMonth()]} ${time.getFullYear()} UTC`;

		await client.user.setPresence({ status: "online", activity:{ name: `coins flip in ${serverCount} servers`, type: `WATCHING` } });

		const channel = client.channels.cache.get('859562190758608956');

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle('It\'s aliveee!')
			.addFields(
				{ name: '__Time:__', value: `${startTime}`, inline: false },
				{ name: '__Server Count:__', value: `${serverCount}`, inline: false },
				{ name: '__User Count:__', value: `${users}`, inline: false }
			)
			.setFooter("I'm back! Time to flip coins.");
		send.sendChannel({ channel: channel, author: 'n/a' }, { embeds: [embed] });

		console.log(`Last restart: ${startTime}\n\nLogged in as ${client.user.tag}! Looking over ${serverCount} servers`);
	}
};