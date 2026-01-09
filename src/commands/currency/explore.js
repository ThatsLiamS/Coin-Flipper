// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, CommandInteraction } = require('discord.js');

const { exploreAreas } = require('./../../util/constants');
const { database } = require('./../../util/functions');


module.exports = {
	name: 'explore',
	description: 'Explore the wilderness and find some cents!',
	usage: '/explore',

	cooldown: {
		time: 60,
		text: '60 Seconds',
	},
	defer: {
		defer: true,
		ephemeral: true,
	},

	data: new SlashCommandBuilder()
		.setName('explore')
		.setDescription('Explore the wilderness and find some cents!')
		.setDMPermission(true),

	/**
	 * @async @function
	 * @group Commands @subgroup Currency
	 * @summary Minigame - earn money
	 * 
	 * @param {Object} param
	 * @param {CommandInteraction} param.interaction - DiscordJS Slash Command Object
	 * 
	 * @returns {Promise<boolean>} True (Success) - triggers cooldown.
	 * @returns {Promise<boolean>} False (Error) - skips cooldown.
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async ({ interaction }) => {

		const area = exploreAreas[Math.floor(Math.random() * exploreAreas.length)];
		const chance = Math.floor(Math.random() * 10);

		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		/* How did they do */
		let result = '';
		if (userData.items.compass > 0) {
			if (chance > 2) {
				result = 'win';
			} else {
				result = 'draw';
			}
		} else {
			if (chance > 4) {
				result = 'win';
			} else if (chance > 2) {
				result = 'draw';
			} else {
				result = 'loss';
			}
		}

		const embed = new EmbedBuilder();

		/* Create the embed based on the result */
		if (result === 'win') {
			let amount = Math.floor(Math.random() * (80 - 40 + 1)) + 40;
			if (userData.settings.evil === true) {
				amount = Math.ceil(amount * 0.5);
			}

			userData.stats.balance = Number(userData.stats.balance) + Number(amount);
			userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(amount);

			embed.setTitle('You explored and found..')
				.setDescription(`You explored ${area.name}, and ${area.got.replace('{earned}', amount)}`)
				.setColor('Green');
		}
		if (result === 'draw') {
			embed.setTitle('Better luck next time')
				.setDescription(`You explored ${area.name} but got no cents...`)
				.setColor('White');
		}
		if (result === 'loss') {
			const amount = Math.floor(Math.random() * (40 - 10 + 1)) + 10;
			userData.stats.balance = Number(userData.stats.balance) - Number(amount);

			embed.setTitle('Aw, you lost cents')
				.setDescription(`You explored ${area.name}, but ${area.lost.replace('{lost}', amount)}`)
				.setColor('Red');
		}

		interaction.followUp({
			embeds: [embed],
		});

		await database.setValue('users', interaction.user.id, userData);
		return true;
	},
};
