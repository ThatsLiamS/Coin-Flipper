/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist } = require('./../../../util/constants.js');
const { achievementAdd } = require('./../../../util/functions.js');

module.exports = {
	name: 'use',
	description: 'Use an item in your inventory!',
	usage: '/use <item>',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 15, text: '15 Seconds' },

	data: new SlashCommandBuilder()
		.setName('use')
		.setDescription('Use an item in your inventory!')
		.setDMPermission(true)

		.addStringOption(option => option.setName('item').setDescription('Which item would you like to use').setRequired(true)
			.addChoices(
				{ 'name': 'Dynamite', 'value': 'dynamite' }, { 'name': 'Party Popper', 'value': 'partypopper' },
				{ 'name': 'Flex your Trophy', 'value': 'goldtrophy' }, { 'name': 'Briefcase', 'value': 'briefcase' },
				{ 'name': 'Broken 8-ball', 'value': 'broken8ball' },
			),
		),

	error: false,
	defer: true,

	/**
	 * Use an intem in your inventory.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Locate the selected item */
		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.id == itemName.toLowerCase())[0];
		if (!item) {
			interaction.followUp({ content: 'That is not a valid item name, please report this.' });
			return false;
		}

		if (userData?.inv[item.id] && userData.inv[item.id] < 1) {
			interaction.followUp({ content: `You do not have ${item.prof}!` });
			return false;
		}

		if (itemName == 'dynamite') {

			const embed = new EmbedBuilder()
				.setTitle('KABOOM')
				.setDescription('You got 250 cents!')
				.setImage('https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif')
				.setColor('Red');

			userData.currencies.cents = Number(userData.currencies.cents) + Number(250);
			userData = achievementAdd(userData, 'kaboom');

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (itemName == 'partypopper') {

			const embed = new EmbedBuilder()
				.setTitle('Woooooooo!!')
				.setDescription('1000 servers! Time to celebrate!')
				.setImage('https://imgur.com/oOP7hRN.gif')
				.setColor('Purple');

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (itemName == 'goldtrophy') {

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username} flexes on all of you!`)
				.setImage('https://imgur.com/iqooiDn.jpg')
				.setColor('Yellow');

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (itemName == 'briefcase') {

			userData.inv.briefcase = Number(userData.inv.briefcase) - Number(1);

			/* Generate random winnings to add to the user */
			let winnings = Math.ceil(Math.random() * (750 - 250) + 250);
			if (userData?.evil == true) winnings = Math.ceil(winnings * 0.9);
			userData.currencies.cents = Number(userData.currencies.cents) + Number(winnings);

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			interaction.followUp({ content: `You opened the briefcase and got ${winnings} cents!` });
			return true;
		}

		if (itemName == 'broken8ball') {

			const responses = ['Ask again later', 'Idk', 'Sorry I don\'t know', 'Why would I know', 'Yes... or no... yeah idk', 'Signs point to nowhere', 'As I see it... i forgot', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on me knowing', 'It is uncertain', 'My reply is maybe', 'My sources are not credible so idk', 'Outlook blank', 'Reply hazy, try again', 'Without a doubt I have no idea', '50% yes, 50% no'];

			const embed = new EmbedBuilder()
				.setTitle('The magic 8ball says...')
				.setDescription(responses[Math.floor(Math.random() * responses.length)])
				.setFooter({ text: 'Well what do you expect its a broken 8ball' })
				.setColor('#828282');

			userData = achievementAdd(userData, 'whatAWaste', true);
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		return false;
	},
};