const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
	name: 'help',
	description: 'Get a list of my commands',
	usage: '`/help [command]`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get a list of my commands!')

		.addStringOption(option => option
			.setName('command')
			.setDescription('Which command or category?')
			.setRequired(false)),

	error: false,
	execute: async ({ interaction, client }) => {

		const cmdName = interaction.options.getString('command');

		const cmd = client.commands.get(cmdName);
		if (cmd) {
			const embed = new MessageEmbed()
				.setColor('#0099FF')
				.setTitle(cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1) + ' Command')
				.setDescription(cmd.description)
				.setTimestamp()
				.addField('__Usage:__', `${cmd.usage}`, false);

			if (cmd.permissions[0] && cmd.ownerOnly == false) {
				embed.addField('__Permissions:__', '`' + cmd.permissions.join('` `') + '`', false);
			}
			if (!cmd.permissions[0] && cmd.ownerOnly == true) {
				embed.addField('__Permissions:__', '**Server Owner Only**', false);
			}
			if (cmd.error == true) {
				embed.addField('__Error:__', 'This command is currently unavailable, please try again later.', false)
					.setColor('RED');
			}

			interaction.followUp({ embeds: [embed], ephemeral: false });
			return;
		}

		const categories = ['flipping', 'currency', 'information', 'karate', 'addons', 'customization', 'online', 'trading', 'donator'];
		if (categories.includes(cmdName)) {
			let description = '__**General**__';

			const commandFiles = readdirSync(`${__dirname}/../../commands/${cmdName}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`${__dirname}/../../commands/${cmdName}/${file}`);
				description = description + `${command.usage}\n`;
			}

			const commandFolders = readdirSync(`${__dirname}/../../commands/${cmdName}`).filter(file => !file.endsWith('.js'));
			if (commandFolders) {
				for (const subCommandFolders of commandFolders) {
					const cmdFiles = readdirSync(`${__dirname}/../../commands/${cmdName}/${subCommandFolders}`).filter(file => file.endsWith('.js'));
					description = description + `\n**__${subCommandFolders}__**`;

					for (const file of cmdFiles) {
						const command = require(`${__dirname}/../../commands/${cmdName}/${subCommandFolders}/${file}`);
						description = description + `\`/${command.name} ${command.usage}\` ${command.description}\n`;
					}

				}
			}


			const embed = new MessageEmbed()
				.setTitle(cmdName.charAt(0).toUpperCase() + cmdName.slice(1) + ' Commands')
				.setDescription(description)
				.setColor('#D3D3D3');

			interaction.followUp({ embeds: [embed], ephemeral: false });
			return;
		}

		const embed = new MessageEmbed()
			.setTitle('Coin Flipper Commands')
			.setDescription('Use `/help <category>` to get commands in one category, or `/help <command>` to get more info on a single command')
			.addFields(
				{ name: ':coin: Flipping', value: 'Commands for flipping coins and using fun addons', inline: true },
				{ name: '💸 Currency', value: 'A variety of commands for getting and spending cents', inline: true },
				{ name: '🛎️ Information', value: 'Invite, support server, privacy policy, and other info', inline: true },
				// { name: '🥋 Karate', value: 'Train, level up, and battle your karate coin with a ton of cool commands', inline: true },
				{ name: '📄 Addons', value: 'Create your own addons for flipping and publish them to the worldwide addon shop', inline: true },
				// { name: '⚙️ Customization', value: 'Commands that let you customize Coin Flipper and its features', inline: true },
				// { name: '🌐 Online', value: 'Visit CoinTopia, an online coin-themed world!', inline: true },
				// { name: '💱 Trading', value: 'Trade items and cents with other users quickly and efficiently!', inline: true },
			)
			.setColor('#cd7f32');

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('LINK').setLabel('Invite').setURL('https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands'),
				new MessageButton()
					.setStyle('LINK').setLabel('Support Server').setURL('https://discord.gg/2je9aJynqt'),
			);

		interaction.followUp({ embeds: [embed], components: [row] });

	},
};