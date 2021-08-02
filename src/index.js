const { ShardingManager } = require('discord.js');

const manager = new ShardingManager(`${__dirname}/Coin Flipper.js`, {
	totalShards: 'auto',
	token: process.env['BotToken']
});

manager.on('shardCreate', shard => {
	console.log(`Launched shard ${shard.id}`);
});

manager.spawn(this.totalShards, 500, -1);