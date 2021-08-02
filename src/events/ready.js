const Discord = require("discord.js");
const send = require(`${__dirname}/../tools/send`);

const monthTranslating = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const getMemberCount = () => {
	return this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
};

module.exports = {
	name: "ready",
	once: true,
	execute: async function(client) {

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(getMemberCount),
		];
		const results = await Promise.all(promises);

		const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
		const users = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

		const time = new Date();
		const startTime = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${monthTranslating[time.getMonth()]} ${time.getFullYear()} UTC`;

		client.user.setPresence({
			status: "online",
			activities: [{ type: `WATCHING`, name: `coins flip in ${servers} servers` }]
		});

		const channel = client.channels.cache.get('859562190758608956');

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle('It\'s aliveee!')
			.addFields(
				{ name: '__Time:__', value: `${startTime}`, inline: false },
				{ name: '__Server Count:__', value: `${servers}`, inline: false },
				{ name: '__User Count:__', value: `${users}`, inline: false }
			)
			.setFooter("I'm back! Time to flip coins.");
		send.sendChannel({ channel: channel, author: 'n/a' }, { embeds: [embed] });

		console.log(`Last restart: ${startTime}\n\nLogged in as ${client.user.tag}! Looking over ${servers} servers`);
	}
};