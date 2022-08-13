/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
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

	/**
	 * Get a list of my commands.
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord Client object
	 * 
	 * @returns {boolean}
	**/
	execute: async ({ interaction, client }) => {

		const cmdName = interaction.options.getString('command');

		/* Shows information on a selected command */
		const cmd = client.commands.get(cmdName);
		if (cmd) {
			const embed = new EmbedBuilder()
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

			/* Send the command-specfic embed and return true */
			interaction.followUp({ embeds: [embed], ephemeral: false });
			return true;
		}

		/* Filter through the files and get the commands from the selected category */
		const categories = ['flipping', 'currency', 'information', 'donator', 'addons'];
		if (categories.includes(cmdName)) {
			let description = '__**General**__\n';

			const commandFiles = readdirSync(`${__dirname}/../../commands/${cmdName}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`${__dirname}/../../commands/${cmdName}/${file}`);
				description = description + `${command.usage}\n`;
			}

			const commandFolders = readdirSync(`${__dirname}/../../commands/${cmdName}`).filter(file => !file.endsWith('.js'));
			if (commandFolders) {
				for (const subCommandFolders of commandFolders) {
					const cmdFiles = readdirSync(`${__dirname}/../../commands/${cmdName}/${subCommandFolders}`).filter(file => file.endsWith('.js'));
					description = description + `\n**__${subCommandFolders.charAt(0).toUpperCase() + subCommandFolders.slice(1)}__**\n`;

					for (const file of cmdFiles) {
						const command = require(`${__dirname}/../../commands/${cmdName}/${subCommandFolders}/${file}`);
						description = description + `${command.usage}\n`;
					}

				}
			}


			const embed = new EmbedBuilder()
				.setTitle(cmdName.charAt(0).toUpperCase() + cmdName.slice(1) + ' Commands')
				.setDescription(description)
				.setColor('#D3D3D3');

			/* Send the category's commands, and return true */
			interaction.followUp({ embeds: [embed], ephemeral: false });
			return true;
		}

		/* List of all our command categories */
		const embed = new EmbedBuilder()
			.setTitle('Coin Flipper Commands')
			.setDescription('Use `/help <category>` to get commands in one category, or `/help <command>` to get more info on a single command')
			.addFields(
				{ name: ':coin: Flipping', value: 'Commands for flipping coins and using fun addons', inline: true },
				{ name: '💸 Currency', value: 'A variety of commands for getting and spending cents', inline: true },
				{ name: '🛎️ Information', value: 'Invite, support server, privacy policy, and other info', inline: true },
				{ name: '📄 Addons', value: 'Create your own addons for flipping and publish them to the worldwide addon shop', inline: true },
			)
			.setColor('#cd7f32');

		/* Creates row on link buttons */
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Invite').setURL('https://discord.com/oauth2/authorize?client_id=668850031012610050&permissions=274945395792&scope=bot%20applications.commands'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link).setLabel('Support Server').setURL('https://discord.gg/2je9aJynqt'),
			);

		/* Returns true to enable the cooldown */
		interaction.followUp({ embeds: [embed], components: [row] });
		return true;

	},
};