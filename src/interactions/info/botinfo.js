const { MessageEmbed } = require('discord.js');

const fitString = (str, length) => {
	length -= str.length;
	return str + ' '.repeat(length);
};

const makeGrid = (results) => {
	const length = [8, 7, 7];

	const border = '+----+----------+----------+---------+';
	const title = '| ID |   PING​   | SERVERS  |  US​ERS  |';
	let rows = [];

	for(let y = 0; y < results[0].length; y++) {
		let values = [y + 1];

		for(let x = 0; x < 3; x++) {
			if(x == '0') {
				let num = results[x][y];
				num = num.toString();
				if(num.length == 2) { num = 0 + num; }

				values.push(`${num} ms  `);
			}
			else { values.push(fitString(results[x][y].toString(), length[x])); }
		}
		rows[y] = `| ${values[0]}  |  ${values[1]}|   ${values[2]}|  ${values[3]}|`;
	}

	let grid = `${border}\n${title}\n${border}\n`;
	for(const row of rows) { grid += `${row}\n`; }
	grid += `${border}`;

	return grid;
};

module.exports = {
	name: 'botinfo',
	description: 'View some information about the bot.',

	myPermissions: ['Send Messages', 'Embed Links'],
	userPermissions: [],

	execute: async (interaction) => {

		const { client } = interaction;

		const promises = [
			client.shard.fetchClientValues('ws.ping'),
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(() => { return this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0); }),
		];
		const results = await Promise.all(promises);

		const embed = new MessageEmbed()
			.setTitle(`${client.user.username}'s Info:`)
			.setColor("#cd7f32")
			.setDescription(`Hi, I'm **Coin Flipper**. My prefix is: \`c!\`\n\n\`\`\`\n${makeGrid(results)}\`\`\``)
			.addFields(
				{ name: `**Total Servers**`, value: `${results[1].reduce((acc, guildCount) => acc + guildCount, 0)}`, inline: true },
				{ name: `**Total Users**`, value: `${results[2].reduce((acc, memberCount) => acc + memberCount, 0)}`, inline: true },
				{ name: `**Total Commands**`, value: `116`, inline: true },

				{ name: `**Uptime:**`, value: `\`${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``, inline: true },
				{ name: `**Shard**`, value: `\`#${Number(interaction.guild.shardId) + 1} out of ${client.shard.count}\``, inline: true },
				{ name: `**Developers:**`, value: `**[ThatsLiamS#6950](https://github.com/ThatsLiamS)**\nSuperPhantomUser#0441\nAsyncBanana#4612`, inline: true },
			);

		interaction.followUp({ embeds: [embed] });
	}
};
