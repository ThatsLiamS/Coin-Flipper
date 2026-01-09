// eslint-disable-next-line no-unused-vars
const { EmbedBuilder, SlashCommandBuilder, CommandInteraction } = require('discord.js');

const { itemlist } = require('./../../../util/constants');
const { achievementAdd, database } = require('./../../../util/functions');

module.exports = {
	name: 'use',
	description: 'Use an item in your inventory!',
	usage: '/use <item>',

	cooldown: {
		time: 15,
		text: '15 Seconds',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('use')
		.setDescription('Use an item in your inventory!')
		.setDMPermission(true)

		.addStringOption(option => option
			.setName('item')
			.setDescription('Which item would you like to use')

			.setRequired(true)
			.addChoices(
				{ 'name': 'Dynamite', 'value': 'dynamite' },
				{ 'name': 'Party Popper', 'value': 'partypopper' },
				{ 'name': 'Flex your Trophy', 'value': 'goldtrophy' }, 
				{ 'name': 'Briefcase', 'value': 'briefcase' },
				{ 'name': 'Broken 8-ball', 'value': 'broken8ball' },
			),
		),

	/**
	 * @async @function
	 * @group Commands @subgroup Currency
	 * @summary Item management - use
	 * 
	 * @param {Object} param
	 * @param {CommandInteraction} param.interaction - DiscordJS Slash Command Object
	 * 
	 * @returns {Promise<boolean>} True (Success) - triggers cooldown.
	 * @returns {Promise<boolean>} False (Error) - skips cooldown.
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async ({ interaction, client }) => {

		/* Locate the selected item */
		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.id === itemName.toLowerCase())[0];
		if (!item) {
			interaction.followUp({
				content: 'That is not a valid item name, please report this.',
			});
			return false;
		}

		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		if (((userData?.items[item.id] || 0) > 0) === false) {
			interaction.followUp({
				content: `You do not have ${item.prof}!`,
			});
			return false;
		}

		if (itemName === 'dynamite') {

			const embed = new EmbedBuilder()
				.setTitle('KABOOM')
				.setDescription('You got 250 cents!')
				.setImage('https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif')
				.setColor('Red');

			userData.stats.balance = Number(userData.stats.balance) + Number(250);
			userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(250);

			interaction.followUp({
				embeds: [embed],
			});

			const newData = await achievementAdd(userData, 'kaboom', client);
			await database.setValue('users', interaction.user.id, newData);
			return true;
		}

		if (itemName === 'partypopper') {

			const embed = new EmbedBuilder()
				.setTitle('Woooooooo!!')
				.setDescription('1000 servers! Time to celebrate!')
				.setImage('https://imgur.com/oOP7hRN.gif')
				.setColor('Purple');

			interaction.followUp({
				embeds: [embed],
			});
			return true;
		}

		if (itemName === 'goldtrophy') {

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username} flexes on all of you!`)
				.setImage('https://imgur.com/iqooiDn.jpg')
				.setColor('Yellow');

			interaction.followUp({
				embeds: [embed],
			});
			return true;
		}

		if (itemName === 'briefcase') {

			userData.items.briefcase = Number(userData.items.briefcase) - Number(1);

			/* Generate random winnings to add to the user */
			let winnings = Math.ceil(Math.random() * (750 - 250) + 250);
			if (userData.settings.evil === true) {
				winnings = Math.ceil(winnings * 0.9);
			}

			userData.stats.balance = Number(userData.stats.balance) + Number(winnings);
			userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(winnings);

			interaction.followUp({
				content: `You opened the briefcase and got ${winnings} cents!`,
			});

			await database.setValue('users', interaction.user.id, userData);
			return true;
		}

		if (itemName === 'broken8ball') {

			const responses = [
				'Ask again later',
				'Idk',
				'Sorry I don\'t know',
				'Why would I know',
				'Yes... or no... yeah idk',
				'Signs point to nowhere',
				'As I see it... i forgot',
				'Better not tell you now',
				'Cannot predict now',
				'Concentrate and ask again',
				'Don\'t count on me knowing',
				'It is uncertain',
				'My reply is maybe',
				'My sources are not credible so idk',
				'Outlook blank',
				'Reply hazy, try again',
				'Without a doubt I have no idea',
				'50% yes, 50% no',
			];

			const randomIndex = Math.floor(Math.random() * responses.length);
			const randomResponse = responses[randomIndex];

			const embed = new EmbedBuilder()
				.setTitle('The magic 8ball says...')
				.setDescription(randomResponse)
				.setFooter({
					text: 'Well what do you expect its a broken 8ball',
				})
				.setColor('#828282');

			interaction.followUp({
				embeds: [embed],
			});

			const newData = await achievementAdd(userData, 'whatAWaste', client);
			await database.setValue('users', interaction.user.id, newData);
			return true;
		}

		return false;
	},
};
