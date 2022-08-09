const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { itemlist } = require('./../../../util/constants.js');
const achievementAdd = require('./../../../util/achievementAdd.js');

module.exports = {
	name: 'use',
	description: 'Use an item in your inventory!',
	usage: '`/use <item>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('use')
		.setDescription('Use an item in your inventory!')

		.addStringOption(option => option.setName('item').setDescription('Which item would you like to use').setRequired(true)
			.addChoices(
				{ 'name': 'Dynamite', 'value': 'dynamite' }, { 'name': 'Party Popper', 'value': 'partypopper' },
				{ 'name': 'Flex your Trophy', 'value': 'goldtrophy' }, { 'name': 'Briefcase', 'value': 'briefcase' },
				{ 'name': 'Broken 8-ball', 'value': 'broken8ball' },
			),
		),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const itemName = interaction.options.getString('item');
		const item = itemlist.filter((i) => i.id == itemName.toLowerCase())[0];
		if (!item) {
			interaction.followUp({ content: 'That is not a valid item name, please report this.' });
			return false;
		}

		if (itemName == 'dynamite') {

			if (userData?.inv?.dynamite < 1) {
				interaction.followUp({ content: 'You do not have a stick of **Dynamite**!' });
				return false;
			}

			const embed = new MessageEmbed()
				.setTitle('KABOOM')
				.setDescription('You got 250 cents!')
				.setImage('https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif')
				.setColor('RED');

			userData.currencies.cents = Number(userData.currencies.cents) + Number(250);
			userData = achievementAdd(userData, 'kaboom');

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (itemName == 'partypopper') {

			if (userData?.inv?.partypopper < 1) {
				interaction.followUp({ content: 'You do not have a **Party Popper**!' });
				return false;
			}

			const embed = new MessageEmbed()
				.setTitle('Woooooooo!!')
				.setDescription('1000 servers! Time to celebrate!')
				.setImage('https://imgur.com/oOP7hRN.gif')
				.setColor('PURPLE');

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (itemName == 'goldtrophy') {

			if (userData?.inv?.goldtrophy < 1) {
				interaction.followUp({ content: '' });
				return false;
			}

			const embed = new MessageEmbed()
				.setTitle(`${interaction.user.username} flexes on all of you!`)
				.setImage('https://imgur.com/iqooiDn.jpg')
				.setColor('YELLOW');

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (itemName == 'briefcase') {

			if (userData?.inv?.briefcase < 1) {
				interaction.followUp({ content: 'You do not have a **briefcase**!' });
				return false;
			}

			userData.inv.briefcase = Number(userData.inv.briefcase) - Number(1);

			let winnings = Math.ceil(Math.random() * (750 - 250) + 250);
			if (userData?.evil == true) winnings = Math.ceil(winnings * 0.9);
			userData.currencies.cents = Number(userData.currencies.cents) + Number(winnings);

			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			interaction.followUp({ content: `You opened the briefcase and got ${winnings} cents!` });
			return true;
		}

		if (itemName == 'broken8ball') {

			if (userData?.inv?.broken8ball < 1) {
				interaction.followUp({ content: '' });
				return false;
			}

			const responses = ['Ask again later', 'Idk', 'Sorry I don\'t know', 'Why would I know', 'Yes... or no... yeah idk', 'Signs point to nowhere', 'As I see it... i forgot', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on me knowing', 'It is uncertain', 'My reply is maybe', 'My sources are not credible so idk', 'Outlook blank', 'Reply hazy, try again', 'Without a doubt I have no idea', '50% yes, 50% no'];

			const embed = new MessageEmbed()
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