/* Import required modules and packages */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { exploreAreas } = require('./../../util/constants.js');
const { database } = require('./../../util/functions.js');

module.exports = {
	name: 'explore',
	description: 'Explore the wilderness and find some cents!',
	usage: '/explore',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 60, text: '60 Seconds' },

	data: new SlashCommandBuilder()
		.setName('explore')
		.setDescription('Explore the wilderness and find some cents!')
		.setDMPermission(true),

	error: false,
	defer: true,

	/**
	 * Explroe the wilderness and find some cents.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		const area = exploreAreas[Math.floor(Math.random() * exploreAreas.length)];
		const chance = Math.floor(Math.random() * 10);

		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		/* How did they do */
		const result = userData.item.compass > 0 ?
			(chance > 2 ? 'win' : 'draw') :
			(chance > 4 ? 'win' : (chance > 2 ? 'draw' : 'loss'));

		const embed = new EmbedBuilder();

		/* Create the embed based on the result */
		if (result == 'win') {
			let amount = Math.floor(Math.random() * (80 - 40 + 1)) + 40;
			if (userData?.settings.evil == true) amount = Math.ceil(amount * 0.5);

			userData.stats.balance = Number(userData.stats.balance) + Number(amount);
			userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(amount);

			embed.setTitle('You explored and found..')
				.setDescription(`You explored the ${area.name}, and ${area.got.replace('{earned}', amount)}`)
				.setColor('Green');
		}
		if (result == 'draw') {
			embed.setTitle('Better luck next time')
				.setDescription(`You explored ${area.name} but got no cents...`)
				.setColor('White');

		}
		if (result == 'loss') {
			const amount = Math.floor(Math.random() * (40 - 10 + 1)) + 10;
			userData.stats.balance = Number(userData.stats.balance) - Number(amount);

			embed.setTitle('Aw, you lost cents')
				.setDescription(`You explored ${area.name}, but ${area.lost.replace('{lost}', amount)}`)
				.setColor('Red');

		}

		interaction.followUp({ embeds: [embed] });

		await database.setValue('users', interaction.user.id, userData);
		return true;

	},
};
