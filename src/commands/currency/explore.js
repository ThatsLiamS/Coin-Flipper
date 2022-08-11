const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { exploreAreas } = require('./../../util/constants.js');

module.exports = {
	name: 'explore',
	description: 'Explore the wilderness and find some cents!',
	usage: '`/explore`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('explore')
		.setDescription('Explore the wilderness and find some cents!'),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const area = exploreAreas[Math.floor(Math.random() * exploreAreas.length)];
		const chance = Math.floor(Math.random() * 10);

		const result = userData.inv.compass > 0 ?
			(chance > 2 ? 'win' : 'draw') :
			(chance > 4 ? 'win' : (chance > 2 ? 'draw' : 'loss'));

		const embed = new EmbedBuilder();

		if (result == 'win') {
			let amount = Math.floor(Math.random() * (80 - 40 + 1)) + 40;
			if (userData?.evil == true) amount = Math.ceil(amount * 0.5);
			userData.currencies.cents = Number(userData.currencies.cents) + Number(amount);

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
			userData.currencies.cents = Number(userData.currencies.cents) - Number(amount);

			embed.setTitle('Aw, you lost cents')
				.setDescription(`You explored ${area.name}, but ${area.lost.replace('{lost}', amount)}`)
				.setColor('Red');

		}

		await firestore.doc(`/users/${interaction.user.id}`).set(userData);

		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
