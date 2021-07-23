const quotaExceeded = false;

const Discord = require('discord.js');
const fs = require('fs');

const check = require(`${__dirname}/../tools/checkReturn`);
const send = require(`${__dirname}/../tools/send`);

let cooldowns = new Discord.Collection();

module.exports = {
	name: 'message',
	execute: async function(message, client, firestore) {
		if (message.author.bot) return;

		/* Banned users */
		let ids = ["818272959621234689", "503734990467498033", "850677330472599552"];
		if (ids.includes(message.author.id)) return;

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
			const cmd = client.commands.get(commandName) || client.commands.find(file => file.aliases && file.aliases.includes(commandName));
			if (cmd) {
				let allowed = true;

				if (cmd.guildOnly && cmd.guildOnly == true) {
					allowed = false;
					await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Sorry, this command can only be ran inside a server.' });
				}

				if (cmd.error && cmd.error == true) {
					allowed = false;
					await send.sendChannel({ channel: message.channel, author: message.author }, { content: 'Sorry, this command is currently out of order. Please try again later!' });
				}

				if (cmd.permissions && allowed === true) {
					for (const permission of cmd.permissions) {
						if (allowed === false && !message.member.hasPermission(permission.trim().toUpperCase().replace(" ", "_")) && !message.member.hasPermission('ADMINISTRATOR')) {
							await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
							allowed = false;
						}
					}
				}

				if (cmd.arguments && allowed === true) {
					const number = cmd.arguments;
					if (number >= 1) {
						if (!args[number - 1]) {
							await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Incorrect usage, make sure it follows the format: \`${prefix}${cmd.name} ${cmd.usage}\`` });
							allowed = false;
						}
					}
				}

				if (cmd.ownerOnly && allowed === true) {
					if (message.author.id !== message.guild.ownerID) {
						await send.sendChannel({ channel: message.channel, author: message.author }, { content: `You do not have permission to use this command. To find out more information, do \`${prefix}help ${cmd.name}\`` });
						allowed = false;
					}
				}

				if (quotaExceeded == true && allowed === true) {
					await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Sorry, we're facing technical difficulties! Please hang tight until it's been sorted.\n(Join the support server for more information from the website: https://coinflipperbot.glitch.me/\n\n**This is the last time that this will happen. The bot will be available again tomorrow.` });
					allowed = false;
				}

				if (!cooldowns.has(cmd.name)) {
					cooldowns.set(cmd.name, new Discord.Collection());
				}

				const now = Date.now();
				const timestamps = cooldowns.get(cmd.name);
				let cooldownAmount = (cmd.cooldown || 0) * 1000;

				if (cmd.name == "flip" && message.channel.id == '832245298969182246') { cooldownAmount = 0; }

				let data;
				if (allowed == true) {
					const checkingData = await firestore.doc(`/users/${message.author.id}`).get();
					data = await check(firestore, checkingData, message.author.id);

					if (data.data().donator == 1) { cooldownAmount = Math.floor(cooldownAmount * 0.75); }
					if (data.data().donator == 2) { cooldownAmount = Math.floor(cooldownAmount * 0.5); }
				}

				if(cmd.developerOnly && allowed == true) {
					if (data.data().inv.toolbox == false) {
						send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, only Coin Flipper developers can use this command!" });
						allowed = false;
					}
				}

				if (timestamps.has(message.author.id)) {
					const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;
						await send.sendChannel({ channel: message.channel, author: message.author }, { content: `Sorry, you have to wait ${timeLeft.toFixed(1)} second(s) to use this command again!` });
						allowed = false;
					}
				}

				if (allowed == true) {

					cmd.execute(message, args, prefix, client, [firestore, data]);

					let commandsRun = client.commandsRun.get("commandsRun", "commandsRun");
					if (!commandsRun) { commandsRun = 0; }
					client.commandsRun.set("commandsRun", commandsRun++, "commandsRun");

					let commandStats = client.commandsRun.get("commandsRun", "commandStats");
					if (!commandStats) { commandStats = {}; }
					let cmdStats = commandStats[cmd.name];
					if (cmdStats === undefined) { cmdStats = 0; }

					commandStats[cmd.name] = cmdStats++;
					client.commandsRun.set("commandsRun", commandStats, "commandStats");

					timestamps.set(message.author.id, now);
					setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

				}
			}
		}
	},
};