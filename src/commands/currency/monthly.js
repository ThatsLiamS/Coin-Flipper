/* Import required modules and files */
const { SlashCommandBuilder } = require('discord.js');
const { database } = require('./../../util/functions.js');

module.exports = {
	name: 'monthly',
	description: 'Claim your monthly cents!',
	usage: '/monthly',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 0, text: '1 Month' },

	data: new SlashCommandBuilder()
		.setName('monthly')
		.setDescription('Claim your monthly cents!')
		.setDMPermission(true),

	error: false,
	defer: true,

	/**
	 * Claim your monthly cents.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		/* Can they use the command */
		if (!userData?.items?.calendar || userData.items?.calendar < 1) {
			interaction.followUp({ content: 'You need a calendar to use this command!' });
			return false;
		}

		/* Calculate the month */
		const date = new Date();
		const today = `${date.getMonth() + 1}|${date.getFullYear()}`;

		if (today == userData.cooldowns.monthly) {
			interaction.followUp({ content: 'You have already claimed it this month!' });
			return false;
		}
		userData.cooldowns.monthly = today;

		/* Add the money to their balance */
		const amount = (userData.stats.donator > 0) ? 25_000 : 20_000;
		userData.stats.balance = Number(userData.stats.balance) + Number(amount);
		userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(amount);

		interaction.followUp({ content: `You claimed your monthly \`${amount}\` cents!` });

		/* returns true, cooldown set within the database */
		await database.setValue('users', interaction.user.id, userData);
		return true;

	},
};
