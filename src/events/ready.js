const Discord = require("discord.js");
const monthTranslating = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

module.exports = {
	name: "ready",
	once: true,
	execute: async function(bot) {
		/*
		await bot.shard.fetchClientValues('guilds.cache.size').then(results => {
			serverCount = results.reduce((acc, guildCount) => acc + guildCount, 0)
		})*/
		const serverCount = bot.guilds.cache.size;
		const users = await bot.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

		const time = new Date();
		const startTime = `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${monthTranslating[time.getMonth()]} ${time.getFullYear()} UTC`;

		await bot.user.setPresence({ status: "online", activity:{ name: `coins flip in ${serverCount} servers`, type: `WATCHING` } });

		const channel = bot.channels.cache.get('859562190758608956');

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setTitle('It\'s aliveee!')
			.addFields(
				{ name: '__Time:__', value: `${startTime}`, inline: false },
				{ name: '__Server Count:__', value: `${serverCount}`, inline: false },
				{ name: '__User Count:__', value: `${users}`, inline: false }
			)
			.setFooter("I'm back! Time to flip coins.");
		channel.send({ embed });

		console.log(`Last restart: ${startTime}\n\nLogged in as ${bot.user.tag}! Looking over ${serverCount} servers`);
	}
};