const { SlashCommandBuilder } = require('@discordjs/builders');const { WebhookClient } = require('discord.js');

const defaultData = require('./../../util/defaultData/users.js').main;

module.exports = {
	name: 'reset',
	description: 'Completely resets a user\'s account',
	usage: '`/reset <user> <reason>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: true,

	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Complete user reset')

		.addSubcommand(subcommand => subcommand
			.setName('by-user')
			.setDescription('Complete user reset!')
			.addUserOption(option => option.setName('user').setDescription('The user to reset').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are we resetting them?').setRequired(true)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('by-user-id')
			.setDescription('Complete user reset!')
			.addStringOption(option => option.setName('user').setDescription('The user ID to rest').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are we resetting them?').setRequired(true)),
		),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const id = interaction.options.getString('user');
		const user = await client.users.fetch(id);

		if (!user) {
			interaction.followUp({ content: 'Invalid ID provided.' });
			return;
		}

		await firestore.doc(`/users/${user.id}`).set(defaultData);

		const webhook = {
			CF: new WebhookClient({ url: process.env['DevLogger_CF'] }),
			ThatsLiamS: new WebhookClient({ url: process.env['DevLogger_ThatsLiamS'] }),
		};

		webhook.CF.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `full user reset:  **${user.username}** (${user.id})` });
		webhook.ThatsLiamS.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `full user reset:  **${user.username}** (${user.id})` });

		interaction.followUp({ content: `Reset **${user.username}** (${user.id})` });

	},
};
