const { WebhookClient } = require('discord.js');
const defaultData = require('./../../util/defaultData/users.js').main;

module.exports = {
	name: 'reset-bal',
	description: 'Reset a user\'s balance & register',
	usage: '<user> <reason>',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: true,

	data: new SlashCommandBuilder()
		.setName('reset-bal')
		.setDescription('Reset a user\'s balance & register')
		
		.addSubcommand(subcommand => subcommand
			.setName('by-user')
			.setDescription('Reset a user\'s balance & register')
			.addUserOption(option => option.setName('user').setDescription('The user to reset').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are we resetting them?'))
		)
			
		.addSubcommand(subcommand => subcommand
			.setName('by-user-id')
			.setDescription('Reset a user\'s balance & register')
			.addStringOption(option => option.setName('user').setDescription('The user ID to rest').setRequired(true))
			.addStringOption(option => option.setName('reason').setDescription('Why are we resetting them?')).setRequired(true)
		),

	error: false,
	execute: async ({ interaction, client, firestore }) => {

		const id = interaction.options.getString('user');
		const user = await client.users.fetch(id);

		if (!user) {
			interaction.followUp({ content: 'Invalid ID provided.' });
			return;
		}

		const userData = await firestore.doc(`/users/${user.id}`).get() || defaultData;
		userData.currencies.cents = 0;
		userData.currencies.register = 0;
		await firestore.doc(`/users/${user.id}`).set(userData);

		const webhook = {
			CF: new WebhookClient({ url: process.env['DevLogger_CF'] }),
			ThatsLiamS: new WebhookClient({ url: process.env['DevLogger_ThatsLiamS'] }),
		};

		webhook.CF.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `reset user balance:  **${user.username}** (${user.id})` });
		webhook.ThatsLiamS.send({ username: interaction.user.username, avatarURL: interaction.user.avatarURL(), content: `reset user balance:  **${user.username}** (${user.id})` });

		interaction.followUp({ content: `Reset the balance of **${user.username}** (${user.id})` });
	},
};
