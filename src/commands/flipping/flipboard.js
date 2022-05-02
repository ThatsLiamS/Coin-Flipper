const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'flipboard',
	description: 'Shows the leaderboard of the top 10 flippers!',
	usage: '`/flipboard`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('flipboard')
		.setDescription('Show the leaderboard of the top 10 flippers!'),

	error: true,
	execute: async ({ interaction, firestore, client }) => {

		let usersArray = [];
		const users = await firestore.collection('users');

		await users.get().then((querySnapshot) => {
			querySnapshot.forEach(async (doc) => {
				try {

					if (!doc.data().stats) doc.data().stats = { flipped: 0 };
					await usersArray.push({
						id: doc.id,
						flips: doc.data().stats.flipped,
					});
				}
				catch {
					/* ignore it */
				}
			});
		});

		setTimeout(async () => {

			usersArray = usersArray.sort((a, b) => b.flips - a.flips);
			usersArray = usersArray.slice(0, 10);

			setTimeout(async () => {

				const embed = new MessageEmbed()
					.setTitle('The Top 10 Coin Flippers ever!')
					.setColor('#e08c38');

				for (const profile of usersArray) {
					if (!profile.id.startsWith('<')) {
						const user = await client.users.fetch(profile.id);
						embed.addField(`${user ? user.tag : 'Unknown user'}`, `${profile.flips} coins flipped`);
					}
				}

				interaction.followUp({ embeds: [embed] });

			}, 1000);

		}, 1000);

	},
};