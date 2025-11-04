require('dotenv').config();
const { ShardingManager } = require('discord.js');
const express = require('express');


/* Set up an express webpage*/
const app = express();
app.get('/', (_req, res) => {
	res.send('Hello World!');
});
app.listen(3000, () => {
	const dateConstruct = new Date();

	const time = `${dateConstruct.getHours()}:${dateConstruct.getMinutes()}`;
	const date = `${dateConstruct.getDate()}/${dateConstruct.getMonth() + 1}/${dateConstruct.getFullYear()}`;

	console.log(`Last restart: ${time}, ${date} UTC`);
});

/* Create and spawn shards */
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

/* Alert when shard has been created */
manager.on('shardCreate', (shard) => {
	console.log(`Launched shard ${shard.id + 1}/${manager.totalShards}`);
});
