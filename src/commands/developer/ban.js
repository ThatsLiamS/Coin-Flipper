const { WebhookClient } = require('discord.js');
const defaultData = require('./../../util/defaultData/users.js').main;

module.exports = {
	name: 'ban',
	description: 'Bans or unbans a user from CF',
	usage: '<user ID> <boolean>',

	permissions: [],
	ownerOnly: false,
	developerOnly: true,

	options: [
		{ name: 'user', description: 'User ID', type: 'STRING', required: true },
		{ name: 'boolean', description: 'Ban or unban the user', type: 'STRING', choices: [{ name: 'ban', value: 'true' }, { name: 'unban', value: 'false' }], required: true },
	],

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
