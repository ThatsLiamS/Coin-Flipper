const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env['FirebaseJson']);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();

const Discord = require("discord.js");
const client = new Discord.Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_EMOJIS_AND_STICKERS', "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	repliedUser: false
});

const enmap = require("enmap");
client.prefixes = new enmap({ name: "prefixes" });
client.commandsRun = new enmap({ name: "commandsRun" });

const { AutoPoster } = require("topgg-autoposter");
const ap = AutoPoster(`${process.env['API_TOKEN']}`, client);
ap.on('posted', () => { });

const fs = require('fs');
client.commands = new Discord.Collection();
const categories = fs.readdirSync(`${__dirname}/commands/`);
for (const category of categories) {
	const commandFiles = fs.readdirSync(`${__dirname}/commands/${category}`).filter(File => File.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${__dirname}/commands/${category}/${file}`);
		client.commands.set(command.name, command);
	}
	const subcategories = fs.readdirSync(`${__dirname}/commands/${category}`).filter(file => !file.endsWith(".js"));
	if (subcategories) {
		for (const subcategory of subcategories) {
			if(!subcategory.startsWith("k_")) {
				const CommandFiles = fs.readdirSync(`${__dirname}/commands/${category}/${subcategory}`);
				for (const file of CommandFiles) {
					const command = require(`${__dirname}/commands/${category}/${subcategory}/${file}`);
					client.commands.set(command.name, command);
				}
			}
		}
	}
}

const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);
	if (event.once) { client.once(event.name, (...args) => event.execute(...args, client)); }
	else { client.on(event.name, (...args) => event.execute(...args, client, firestore));}
}

const sendError = (error) => {
	const embed = new Discord.MessageEmbed().setDescription(error.toString());
	client.channels.cache.get('868455901659541565').send({ embeds: [embed] });
};
['uncaughtExceptionMonitor', 'warning', 'uncaughtException'].forEach(m => {
	process.on(m, (err) => sendError(err));
});


require('dotenv').config();
client.login(process.env['BotToken']);