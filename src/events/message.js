const discord = require('discord.js');
const fs = require("fs");
const check = require("../tools/checkReturn");

const quotaExceeded = false;

const commands = {};
const categories = fs.readdirSync(`${__dirname}/../commands`);
for (let category of categories) {
	const commandFiles = fs.readdirSync(`${__dirname}/../commands/${category}`).filter(file => file.endsWith('.js'));
	for (let file of commandFiles) {
		const command = require(`${__dirname}/../commands/${category}/${file}`);
		commands[command.name] = command;
		if (command.aliases) {
			command.aliases.forEach(alias => {
				commands[alias] = command;
			});
		}
	}
	const subCategories = fs.readdirSync(`${__dirname}/../commands/${category}`).filter(file => !file.endsWith(".js"));
	if (subCategories) {
		for (let subCategory of subCategories) {
			if(!subCategory.startsWith("k_")) {
				const innerCommandFiles = fs.readdirSync(`${__dirname}/../commands/${category}/${subCategory}`);
				for (let innerFile of innerCommandFiles) {
					const command = require(`${__dirname}/../commands/${category}/${subCategory}/${innerFile}`);
					commands[command.name] = command;
					if (command.aliases) {
						command.aliases.forEach(alias => {
							commands[alias] = command;
						});
					}
				}
			}
		}
	}
}

const commandCooldown = {};
for (let key in commands) {
	commandCooldown[key] = commands[key];
}

module.exports = {
	name: 'message',
	execute: async function(msg, bot, firestore) {
		async function send(content) {
			msg.channel.send(content).catch(() => {
				msg.channel.send("Sorry, I don't have the right permissions to use that command!").catch(() => {
					msg.author.send("Sorry, I don't have the right permissions to use that command!").catch(() => { });
				});
			});
		}
		let isCommand = false;
		let prefix = "c!";
		if (msg.guild) {
			bot.prefixes.ensure(msg.guild.id, {
				prefix: "c!"
			});
			let guildPrefix = bot.prefixes.get(msg.guild.id, "prefix");
			if (guildPrefix) prefix = guildPrefix;
		}
		else {
			prefix = "c!";
		}
		let content = msg.content.toLowerCase().trim();
		if (msg.guild || content.startsWith("c!karate choose") || content.startsWith("t!karate choose") || content.startsWith("c!addtrade") || content.startsWith("c!removetrade") || content.startsWith("c!finish") || content.startsWith("c!cancel") || content.startsWith("c!accept")) isCommand = content.startsWith(prefix);
		else isCommand = false;
		if (isCommand) {

			if (msg.author.bot) return;
			let args;
			let command;
			bot.commandsRun.ensure("commandsRun", {
				commandsRun: 0,
				commandStats: {}
			});
			let upperCase = false;
			let clean = false;
			for (let c of ["createaddon", "create", "renameaddon", "rename", "giveitem"]) {
				if (content.startsWith(`${prefix}${c}`)) upperCase = true;
			}
			for (let c of ["createaddon", "create", "renameaddon", "rename", "setbio", "setaddress"]) {
				if (content.startsWith(`${prefix}${c}`)) clean = true;
			}
			if (upperCase && clean) {
				args = msg.cleanContent.slice(prefix.length).trim().split(/ +/g);
				command = args.shift();
			}
			else if (upperCase) {
				args = msg.content.slice(prefix.length).trim().split(/ +/g);
				command = args.shift();
			}
			else if (clean) {
				args = msg.cleanContent.toLowerCase().slice(prefix.length).trim().split(/ +/g);
				command = args.shift();
			}
			else {
				args = content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
				command = args.shift();
			}
			for (let property in commands) {
				let aliases = commands[property].aliases;
				if (aliases != undefined) {
					for (let aliase of aliases) {
						if (command == aliase) command = property;
					}
				}
			}
			if (commands[command] == undefined) return;
			if (typeof commands[command] === "string") {
				command = commands[command];
			}

			let ids = ["818272959621234689", "503734990467498033", "850677330472599552"];
			if (ids.includes(msg.author.id)) return;

			if (quotaExceeded == true) {
				send("Sorry, we're facing technical difficulties! Please hang tight until it's been sorted.\n(Join the support server for more information from the website: https://coinflipperbot.glitch.me/\n\n**This is the last time that this will happen. The bot will be available again tomorrow.**\n**In the meantime, join the support server to celebrate reaching 1000 servers! (`c!1000`)**");
				return;
			}

			if (msg.channel.type != "dm" && !msg.member.hasPermission(commands[command].permissions)) return send(`You need the ${commands[command].permissions} permission to do this command!`);
			try {
				if (commandCooldown[command][msg.author.id]) {
					send(`You must wait to use that again!`);
					return;
				}
				let newData;
				if (["1000", "sendmessage"].includes(command)) { newData = {}; }
				else {
					let data = await firestore.doc(`/users/${msg.author.id}`).get();
					let userData = data.data();
					newData = await check(firestore, data, msg.author.id);
					userData = newData.data();
					if (userData.banned == true) { return; }
				}
				let commandsRun = bot.commandsRun.get("commandsRun", "commandsRun");
				if (!commandsRun) commandsRun = 0;
				commandsRun++;
				bot.commandsRun.set("commandsRun", commandsRun, "commandsRun");
				let commandStats = bot.commandsRun.get("commandsRun", "commandStats");
				if (!commandStats) commandStats = {};
				let cmdStats = commandStats[command];
				if (cmdStats === undefined) cmdStats = 0;
				cmdStats++;
				commandStats[command] = cmdStats;
				bot.commandsRun.set("commandsRun", commandStats, "commandStats");
				await commands[command].execute(firestore, args, command, msg, discord, newData, send, bot);
				if (commands[command].cooldown) {
					if (command == "flip" && msg.channel.id == 832245298969182246) return;
					let time = commands[command].cooldown;
					if (newData.data().donator == 1) time = Math.floor(time * 0.75);
					if (newData.data().donator == 2) time = Math.floor(time * 0.5);
					commandCooldown[command][msg.author.id] = 1;
					bot.cooldowns = commandCooldown;
					setTimeout(() => {
						commandCooldown[command][msg.author.id] = undefined;
						bot.cooldowns = commandCooldown;
					}, time);
				}
			}
			catch (err) {
				console.log(err);
			}
		}
	},
};