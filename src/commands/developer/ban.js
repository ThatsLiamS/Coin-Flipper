const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient } = require('discord.js');
const defaultData = require('./../../util/defaultData/users.js').main;

module.exports = {
	name: 'ban',
	description: 'Bans or unbans a user from CF',
	usage: '<user> <boolean> <reason>',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: true,

	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user from using the bot')
		
		.addSubcommand(subcommand => subcommand
			.setName('by-user')
			.setDescription('Bans a user from using the bot')
			.addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
			.addBooleanOption(option => option.setName('boolean').setDescription('(Ban = True) || (Unban = False)')).setRequired(true)
			.addStringOption(option => option.setName('reason').setDescription('Why are we banning them?'))
		)
			
		.addSubcommand(subcommand => subcommand
			.setName('by-user-id')
			.setDescription('Bans a user from using the bot')
			.addStringOption(option => option.setName('user').setDescription('The user ID to ban').setRequired(true))
			.addBooleanOption(option => option.setName('boolean').setDescription('(Ban = True) || (Unban = False)')).setRequired(true)
			.addStringOption(option => option.setName('reason').setDescription('Why are we banning them?')).setRequired(true)
		),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const boolean = interaction.options.getString('boolean');
		const id = interaction.options.getString('user');
		const user = await client.users.fetch(id);

		if (!user) {
			interaction.followUp({ content: 'Invalid ID provided.' });
			return;
		}

		const userData = await firestore.doc(`/users/${user.id}`).get() || defaultData;
		const webhook = {
			CF: new WebhookClient({ url: process.env['DevLogger_CF'] }),
			ThatsLiamS: new WebhookClient({ url: process.env['DevLogger_ThatsLiamS'] }),
		};

		if (boolean == 'true') {
			userData.banned = true;
			await firestore.doc(`/users/${user.id}`).set(userData);

			webhook.CF.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `banned user:  **${user.username}** (${user.id})` });
			webhook.ThatsLiamS.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `banned user:  **${user.username}** (${user.id})` });
		}

		if (boolean == 'false') {
			userData.banned = false;
			await firestore.doc(`/users/${user.id}`).set(userData);

			webhook.CF.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `unbanned user:  **${user.username}** (${user.id})` });
			webhook.ThatsLiamS.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `unbanned user:  **${user.username}** (${user.id})` });
		}

		interaction.followUp({ content: `Set **${user.username}** (${user.id}) banned status to ${boolean}!` });

	},
};
