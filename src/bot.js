const fs = require('fs');

const { Client, GatewayIntentBits, Partials } = require('discord.js');


/* DiscordJS Client initialisation */
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildWebhooks,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.Reaction,
	],
});

/* Load files from src/events */
const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	// eslint-disable-next-line security/detect-non-literal-require
	const event = require(__dirname + '/events/' + file);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

/* DiscordJS Client Login */
client.login(process.env['BotToken']);
