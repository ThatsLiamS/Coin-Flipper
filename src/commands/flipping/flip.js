/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const flips = require('./../../util/flips.js');
const { gotItem, achievementAdd } = require('./../../util/functions.js');

module.exports = {
	name: 'flip',
	description: 'Flip a coin, or spice it up with an addon!',
	usage: '`/flip [addon]`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('flip')
		.setDescription('Flip a coin, or spice it up with an addon!')

		.addStringOption(option => option
			.setName('addon')
			.setDescription('What\'s the addon\'s name?')
			.setRequired(false),
		),

	error: false,

	/**
	 * Flip a code or spice it up with an addon
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 * 
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		const flip = async (responses, multiplier = 1, briefcaseChance = 95, type = 'normal') => {

			/* Increase coins flipped stats */
			userData.stats.flipped = Number(userData.stats.flipped) + 1;

			if (userData.stats.flipped >= 1000) userData = achievementAdd(userData, 'ultimateFlipper');
			if (type == 'normal') {

				/* Calculate amount won per flip */
				let amount = Math.floor(((Math.random() * 11) + 5) * (userData.currencies.multiplier || 1));
				if (userData.evil != true) amount = Math.ceil(amount * multiplier);
				if (userData.inv.platinumdisk > 0 && userData.evil != true) amount = Math.ceil(amount * 3);
				else if (userData.inv.golddisk > 0 && userData.evil != true) amount = Math.ceil(amount * 2);

				userData.currencies.cents = Number(userData.currencies.cents) + amount;
				let message = `You got ${amount} coins!`;


				/* Calculate amount for the register */
				let percent = 0.1;

				if (userData.donator == 1) percent = 0.15;
				if (userData.donator == 2) percent = 0.25;
				if (userData.evil == true) percent = 0.075;
				if (userData.inv.label > 0 && userData.evil != true) percent += 0.1;

				userData.currencies.register = Number(userData.currencies.register) + Math.ceil(amount * percent);


				/* Did they win a briefcase? */
				if (userData.evil == true) briefcaseChance = 99;
				if (userData.donator == 1) briefcaseChance -= 5;
				if (userData.donator == 2) briefcaseChance -= 10;

				if ((Math.random() * 100) > briefcaseChance) {
					userData.inv.briefcase = Number(userData.inv.briefcase) + 1;
					message = message + 'You also got a 💼 Briefcase!';
					gotItem(userData);
				}


				/* Allow for custom placeholders */
				const placeholders = ['cents', 'register', 'multiplier', 'donator', 'job', 'flipped', 'minigames'];
				const convertPlaceholders = {
					'cents': userData.currencies.cents,
					'register': userData.currencies.register,
					'multiplier': userData.currencies.multiplier,
					'donator': userData.donator == 0 ? 'none' : (userData.donator == 1 ? 'gold tier' : 'platinum tier'),
					'job': userData.job,
					'flipped': userData.stats.flipped,
					'minigames': userData.stats.minigames_won,
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
				await firestore.doc(`/users/${interaction.user.id}`).set(userData);
				return;
			}

			/* /flip karate edition */
			else {

				/* Add karate XP to the userData */
				const amount = Math.floor(Math.random() * 6) + 5;
				let message = `You got ${amount} XP!`;

				userData.karate.xp = Number(userData.karate.xp) + amount;
				let level = userData.karate.level;

				if (userData.karate.xp > (level * 20)) {
					let bal = userData.karate.xp;
					level = Number(level) + Number(1);
					bal = bal - ((level - 1) * 20);

					if (bal < 0) bal = 0;
					if (level == 2) userData.karate.belt = 'red';
					if (level == 4) userData.karate.belt = 'yellow';
					if (level == 6) userData.karate.belt = 'orange';
					if (level == 9) userData.karate.belt = 'green';
					if (level == 12) userData.karate.belt = 'blue';
					if (level == 15) userData.karate.belt = 'purple';
					if (level == 16) await achievementAdd(userData, 'blackBelt');
					if (level == 21) userData.karate.belt = 'brown';
					if (level == 27) {
						userData.karate.belt = 'black';

						userData.inv.masteruniform = Number((userData.inv.masteruniform || 0) + 1);
						userData = achievementAdd(gotItem(userData), 'theMaster');
					}
					userData.karate.level = level;
					userData.karate.xp = bal;

					message += ` You also leveled up to **level ${level}**!`;
				}

				/* Create and send the embed */
				const embed = new EmbedBuilder()
					.setColor('Red')
					.setTitle(responses[Math.floor(Math.random() * responses.length)])
					.setDescription(message);

				interaction.followUp({ embeds: [embed] });

				/* Update the userData */
				await firestore.doc(`/users/${interaction.user.id}`).set(userData);
				return;

			}

		};


		const addon = interaction.options.getString('addon');

		if (addon == 'extra') return await flip(flips['extra']);
		if (addon == 'opposite') return await flip(flips['opposite']);

		if (addon == 'penny' && userData.inv.bronzecoin > 0) return await flip(flips['penny']);
		if (addon == 'dime' && userData.inv.silvercoin > 0) return await flip(flips['dime']);
		if (addon == 'dollar' && userData.inv.goldcoin > 0) return await flip(flips['dollar'], 1.5);
		if (addon == '24' && userData.inv.kcoin > 0) return await flip(flips['24'], 1, 90);

		if (addon == 'train' && userData.karate.abilities.flip == true) return await flip(flips['train'], 1, 150, 'karate');


		return await flip(flips.normal);

	},
};
