const quotaExceeded = false;

const check = require("../tools/checkReturn");
const Discord = require('discord.js');
const fs = require('fs');

let commands = new Discord.Collection();
const categories = fs.readdirSync(`${__dirname}/commands/`);
for (const category of categories) {
	const commandFiles = fs.readdirSync(`${__dirname}/commands/${category}`).filter(File => File.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${__dirname}/commands/${category}/${file}`);
		commands.set(command.name, command);
	}
	const subcategories = fs.readdirSync(`${__dirname}/commands/${category}`).filter(file => !file.endsWith(".js"));
	if (subcategories) {
		for (const subcategory of subcategories) {
			if(!subcategory.startsWith("k_")) {
				const CommandFiles = fs.readdirSync(`${__dirname}/commands/${category}/${subcategory}`);
				for (const file of CommandFiles) {
					const command = require(`${__dirname}/commands/${category}/${subcategory}/${file}`);
					commands.set(command.name, command);
				}
			}
		}
	}
}

let cooldowns = new Discord.Collection();

const commandCooldown = {};
for (let key in commands) {
	commandCooldown[key] = commands[key];
}

module.exports = {
	name: 'message',
	execute: async function(message, client, firestore) {
		if (message.author.bot) return;

		/* Banned users */
		let ids = ["818272959621234689", "503734990467498033", "850677330472599552"];
		if (ids.includes(message.author.id)) return;

		async function send(content) {
			await message.channel.send(content).catch(() => {
				message.channel.send("Sorry, I don't have the right permissions to use that command!").catch(() => {
					message.author.send("Sorry, I don't have the right permissions to use that command!").catch(() => { });
				});
			});
		}

		let prefix = "c!";
		if (message.guild) {
			client.prefixes.ensure(message.guild.id, { prefix: "c!" });
			let guildPrefix = client.prefixes.get(message.guild.id, "prefix");
			if (guildPrefix) { prefix = guildPrefix; }
		}
		else { prefix = "c!"; }

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		if (commandName.length !== 0) {
			const cmd = commands.get(commandName) || commands.find(file => file.aliases && file.aliases.includes(commandName));
			if (cmd) {
				let allowed = true;

				if (cmd.guildOnly && cmd.guildOnly == true) {
					allowed = false;
					await send({ content: 'Sorry, this command can only be ran inside a server.' });
				}

				if (cmd.error && cmd.error == true) {
					allowed = false;
					await send({ content: 'Sorry, this command is currently out of order. Please try again later!' });
				}

				if (cmd.permissions && allowed === true) {
					for (const permission of cmd.permissions) {
						if (allowed === false && !message.member.hasPermission(permission.trim().toUpperCase().replace(" ", "_")) && !message.member.hasPermission('ADMINISTRATOR')) {
							await send({ content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
							allowed = false;
						}
					}
				}

				if (cmd.arguments && allowed === true) {
					const number = cmd.arguments;
					if (number >= 1) {
						if (!args[number - 1]) {
							await send({ content: `Incorrect usage, make sure it follows the format: \`${prefix}${cmd.name} ${cmd.usage}\`` });
							allowed = false;
						}
					}
				}

				if (cmd.ownerOnly && allowed === true) {
					if (message.author.id !== message.guild.ownerID) {
						await send({ content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
						allowed = false;
					}
				}

				if (quotaExceeded == true && allowed === true) {
					await send({ content: `Sorry, we're facing technical difficulties! Please hang tight until it's been sorted.\n(Join the support server for more information from the website: https://coinflipperbot.glitch.me/\n\n**This is the last time that this will happen. The bot will be available again tomorrow.` });
					allowed = false;
				}

				if (!cooldowns.has(cmd.name)) {
					cooldowns.set(cmd.name, new Discord.Collection());
				}

				const now = Date.now();
				const timestamps = cooldowns.get(cmd.name);
				let cooldownAmount = (cmd.cooldown || 0) * 1000;

				if (cmd.name == "flip" && message.channel.id == '832245298969182246') { cooldownAmount = 0; }
				if (allowed == true) {
					const data = await firestore.doc(`/users/${message.author.id}`).get();
					const newData = await check(firestore, data, message.author.id);

					if (newData.data().donator == 1) { cooldownAmount = Math.floor(cooldownAmount * 0.75); }
					if (newData.data().donator == 2) { cooldownAmount = Math.floor(cooldownAmount * 0.5); }
				}

				if (timestamps.has(message.author.id)) {
					const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;
						await send({ content: `Sorry, you have to wait ${timeLeft.toFixed(1)} second(s) to use this command again!` });
						allowed = false;
					}
				}

				if (allowed == true) {

					cmd.execute(message, args, prefix, client, firestore);

					/* Database logs*/
					let commandsRun = client.commandsRun.get("commandsRun", "commandsRun");
					if (!commandsRun) { commandsRun = 0; }
					client.commandsRun.set("commandsRun", commandsRun++, "commandsRun");

					let commandStats = client.commandsRun.get("commandsRun", "commandStats");
					if (!commandStats) { commandStats = {}; }
					let cmdStats = commandStats[cmd.name];
					if (cmdStats === undefined) { cmdStats = 0; }

					commandStats[cmd.name] = cmdStats++;
					client.commandsRun.set("commandsRun", commandStats, "commandStats");
					/* Cooldowns */
					timestamps.set(message.author.id, now);
					setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

				}
			}
		}
	},
};