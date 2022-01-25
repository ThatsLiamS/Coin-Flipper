const { MessageEmbed } = require('discord.js');
const defaultData = require('./../../util/defaultData/users');

module.exports = {
	name: 'userinfo',
	description: 'View a user\'s stats.',
	usage: '',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	options: [
		{ name: 'user', description: 'Select a user', type: 'USER', required: false },
	],

	error: false,
	execute: async ({ interaction, firestore }) => {

		const user = interaction.options.getUser('user') || interaction.user;
		const collection = await firestore.collection('users').doc(user.id).get();
		const userData = collection.data() || defaultData;

		const embed = new MessageEmbed()
			.setTitle(`${user.username}'s information`)
			.setColor('cd7f32')
			.addFields(
				{ name: '**Settings**', value: `Evil mode: ${userData.evil ? '<:true:832294753121861632>' : '<:false:832295611905867816>' }\nCompact mode: ${userData.compact ? '<:true:832294753121861632>' : '<:false:832295611905867816>' }\nOnline mode: ${userData.online.online ? '<:true:832294753121861632>' : '<:false:832295611905867816>' }`, inline: false },
				{ name: '**Stats**', value: `Coins flipped: \`${userData.stats.flipped}\`\nMinigames won: \`${userData.stats.minigames_won}\`\nTimes worked: \`${userData.stats.timesWorked}\`\nKarate battles won: \`${userData.stats.timesWon}\`\nTrading sessions completed: \`${userData.stats.tradingSessionsCompleted || 0}\``, inline: false },
				{ name: '**Donator Status**', value: `${userData.donator == 0 ? 'None' : (userData.donator == 1 ? 'Gold' : 'Platinum')}`, inline: false },
			);

		interaction.followUp({ embeds: [embed] });

	},
};