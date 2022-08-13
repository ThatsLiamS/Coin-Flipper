/* DiscordJS Client initialisation */
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildWebhooks],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

/* Connection to the Firestore Database */
const admin = require('firebase-admin');
admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(process.env['Database'])),
});
const firestore = admin.firestore();

/* Load files from src/events */
const fs = require('fs');
const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(__dirname + '/events/' + file);
	/* Set up event listeners */
	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client, firestore));
}

/* DisordJS Client Login */
client.login(process.env['BotToken']);
