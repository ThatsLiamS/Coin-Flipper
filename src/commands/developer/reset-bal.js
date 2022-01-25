const { WebhookClient } = require('discord.js');
const defaultData = require('./../../util/defaultData/users.js').main;

module.exports = {
	name: 'reset-bal',
	description: 'Reset a user\'s balance & register',
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
