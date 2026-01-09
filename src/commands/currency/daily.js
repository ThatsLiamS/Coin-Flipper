// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, SlashCommandBuilder, CommandInteraction } = require('discord.js');

const { database } = require('./../../util/functions');


module.exports = {
	name: 'daily',
	description: 'Claim your daily cents!',
	usage: '/daily',

	cooldown: {
		time: 0,
		text: '1 Day',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim your daily cents!')
		.setDMPermission(true),

	/**
	 * @async @function
	 * @group Commands @subgroup Currency
	 * @summary Daily - earn money
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

		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		/* Get the date */
		const dateConstruct = new Date();
		let today = `${dateConstruct.getDate()}|${dateConstruct.getMonth() + 1}|${dateConstruct.getFullYear()}`;

		const cooldown = userData.cooldowns.daily.split('-');
		if (today === cooldown[0]) {
			if (!cooldown[1] && (userData.items.vault || 0) < 1) {
				interaction.followUp({
					content: 'You have already claimed your daily reward!',
				});
				return false;
			}

			if (cooldown[1] === 'bonus') {
				interaction.followUp({
					content: 'You have already claimed your bonus daily reward!',
				});
				return false;
			}
			today = `${today}-bonus`;
		}
		userData.cooldowns.daily = today;

		/* How much do they claim */
		let randomAmt = Math.floor(Math.random() * (6000 - 4000 + 1)) + 1000;
		if (userData.stats.donator > 0) {
			randomAmt = Math.ceil(randomAmt * 1.5);
		}

		const embed = new EmbedBuilder()
			.setTitle('You claimed your daily reward!')
			.setDescription(`You got \`${randomAmt}\` cents!\nMake sure to come back tomorrow to claim your next one!`)
			.setColor('Green');

		interaction.followUp({
			embeds: [embed],
		});

		/* Set the balance in the database */
		userData.stats.balance = Number(userData.stats.balance) + Number(randomAmt);
		userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(randomAmt);

		await database.setValue('users', interaction.user.id, userData);
		return true;
	},
};
