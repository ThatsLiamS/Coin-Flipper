const { WebhookClient } = require('discord.js');
const defaultData = require('./../../util/defaultData/users.js').main;

module.exports = {
	name: 'reset',
	description: 'Completely resets a user\'s account',
	usage: '<user ID>',

	permissions: [],
	ownerOnly: false,
	developerOnly: true,

	options: [
		{ name: 'user', description: 'User ID', type: 'STRING', required: true },
	],

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
