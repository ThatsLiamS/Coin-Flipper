/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { flips } = require('./../../util/constants.js');
const { gotItem, achievementAdd, database } = require('./../../util/functions.js');

module.exports = {
	name: 'flip',
	description: 'Flip a coin, or spice it up with an addon!',
	usage: '/flip [addon]',

	cooldown: { time: 5, text: '5 Seconds' },
	defer: { defer: true, ephemeral: true },

	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flip a coin, or spice it up with an addon!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('addon').setDescription('What\'s the addon\'s name?').setRequired(false).setMaxLength(50)),

	/**
	 * Flip a code or spice it up with an addon
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord bot client
	 * @returns {boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Fetch the user's data */
		let userData = await database.getValue('users', interaction.user.id);

		const flip = async (responses, multiplier = 1, briefcaseChance = 95) => {

			/* Increase coins flipped stats */
			userData.stats.flips = Number(userData.stats.flips) + 1;
			if (userData.stats.flips >= 1000) userData = await achievementAdd(userData, 'ultimateFlipper', client);

			/* Calculate amount won per flip */
			let amount = Math.floor((Math.random() * 11) + 5);

			if (userData.settings.evil != true) amount = Math.ceil(amount * multiplier);
			if (userData.items.platinumdisk > 0 && userData.settings.evil != true) amount = Math.ceil(amount * 3);
			else if (userData.items.golddisk > 0 && userData.settings.evil != true) amount = Math.ceil(amount * 2);

			userData.stats.balance = Number(userData.stats.balance) + amount;
			userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + amount;

			/* Calculate amount for the register */
			let percent = (userData.stats.donator == 1) ? 0.15 : (
				userData.stats.donator == 2 ? 0.25 : (
					userData.settings.evil == true ? 0.075 : 0.1
				));

			if (userData.items.label > 0 && userData.settings.evil != true) percent += 0.1;
			userData.stats.bank = Number(userData.stats.bank || 0) + Math.ceil(amount * percent);

			/* Did they win a briefcase? */
			if (userData.settings.evil == true) briefcaseChance = 99;
			if (userData.stats.donator == 1) briefcaseChance -= 5;
			if (userData.stats.donator == 2) briefcaseChance -= 10;

			let message = `You got ${amount} coins!`;
			if ((Math.random() * 100) > briefcaseChance) {
				userData.items.briefcase = Number(userData.items.briefcase || 0) + 1;
				message = message + ' You also got a 💼 Briefcase!';

				userData = await gotItem(userData, client);
			}

			/* Allow for custom placeholders */
			const placeholders = ['cents', 'register', 'donator', 'job', 'flipped', 'minigames'];
			const convertPlaceholders = {
				'cents': userData.stats.balance,
				'register': userData.stats.bank,
				'donator': userData.stats.donator == 0 ? 'none' : (userData.stats.donator == 1 ? 'gold tier' : 'platinum tier'),
				'job': userData.stats.job,
				'flipped': userData.stats.flips,
				'minigames': userData.stats.minigames,
			};

			let response = responses[Math.floor(Math.random() * responses.length)];
			for (const placeholder of placeholders) {
				while (response.includes(`{${placeholder}}`)) {
					response = response.replace(`{${placeholder}}`, `${convertPlaceholders[placeholder]}`);
				}
			}


			/* Create and send the embed */
			const embed = new EmbedBuilder()
				.setColor('Orange')
				.setTitle(response)
				.setDescription(message);

			interaction.followUp({ embeds: [embed] });

			/* Update the userData */
			await database.setValue('users', interaction.user.id, userData);
			return;

		};


		const addon = interaction.options.getString('addon');

		if (addon == 'extra') return await flip(flips['extra']);
		if (addon == 'opposite') return await flip(flips['opposite']);

		if (addon == 'penny' && userData.items.bronzecoin > 0) return await flip(flips['penny']);
		if (addon == 'dime' && userData.items.silvercoin > 0) return await flip(flips['dime']);
		if (addon == 'dollar' && userData.items.goldcoin > 0) return await flip(flips['dollar'], 1.5);
		if (addon == '24' && userData.items.kcoin > 0) return await flip(flips['24'], 1, 90);

		const customAddons = userData.addons.filter((a) => a.name == addon);
		if (customAddons[0]) return await flip(customAddons[0].responses);

		return await flip(flips.normal);

	},
};
