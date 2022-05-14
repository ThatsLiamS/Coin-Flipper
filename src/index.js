require('dotenv').config();
const { ShardingManager } = require('discord.js');


const manager = new ShardingManager('./src/bot.js', {
	totalShards: 'auto',
	token: process.env['BotToken'],
	respawn: true,
});

manager.spawn({
	amount: manager.totalShards,
	delay: 500,
	timeout: -1,
});

manager.on('shardCreate', (shard) => {
	console.log(`Launched shard ${shard.id + 1}/${manager.totalShards}`);
});
