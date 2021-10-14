const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello World!'));

const time = new Date();
app.listen(3000, () => console.log(`Last full restart: ${time.getHours()}:${time.getMinutes() + 1}, ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} UTC`));


require('dotenv').config();
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager(`${__dirname}/Coin Flipper.js`, {
	totalShards: 'auto',
	token: process.env['BotToken']
});

manager.on('shardCreate', shard => {
	console.log(`Shard ${shard.id} launched`);
});

manager.spawn(this.totalShards, 500, -1);