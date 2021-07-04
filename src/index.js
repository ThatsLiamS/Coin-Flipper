const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FirebaseJson);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();

const Discord = require("discord.js");
const client = new Discord.Client();

const enmap = require("enmap");
client.prefixes = new enmap({ name: "prefixes" });
client.commandsRun = new enmap({ name: "commandsRun" });

const autoposter = require("topgg-autoposter");
const ap = autoposter(`${process.env['API_TOKEN']}`, client);
ap.on('posted', () => {});

const fs = require('fs');
const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);
	if (event.once) { client.once(event.name, (...args) => event.execute(...args, client)); }
	else { client.on(event.name, (...args) => event.execute(...args, client, firestore));}
}

client.login(process.env['BotToken']);