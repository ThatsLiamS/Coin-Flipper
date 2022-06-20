const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

const { dropshipItems } = require('./../../util/constants.js');

module.exports = {
	name: 'dropship',
	description: 'Dropship an item and try to earn some cents!',
	usage: '`/dropship`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('dropship')
		.setDescription('Dropship an item and try to earn some cents!'),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const chance = Math.floor(Math.random() * 30);

		const largeWin = Math.floor(Math.random() * (700 - 300 + 1)) + 300;
		const smallWinOne = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
		const smallWinTwo = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

		let list = [];
		if (chance > 20) list = [largeWin, smallWinOne, smallWinTwo];
		else if (chance > 10) list = [smallWinOne, largeWin, smallWinTwo];
		else list = [smallWinOne, smallWinTwo, largeWin];

		const row = new MessageActionRow();
		for (const value of list) {
			const item = dropshipItems[Math.floor(Math.random() * dropshipItems.length)];
			row.addComponent(
				new MessageButton().setStyle('PRIMARY').setLabel(item).setCustomId(`dropship-${value}-${item}`),
			);
		}
		const embed = new MessageEmbed()
			.setTitle('Dropship!')
			.setDescription('Select one of the items below.');

		const sentMessage = await interaction.follwoUp({ embeds: [embed], components: [row] });
		if (!sentMessage) return false;

		const filter = (button) => button.customId.startsWith('dropship-') && button.user.id === interaction.user.id;
		const accepted = await interaction.channel.awaitMessageComponent({ filter, time: 45_000, componentType: 'BUTTON' })
			.then(async (button) => {
				const values = button.customId.split('-');
				userData.currencies.cents = Number(userData.currencies.cents) + Number(values[1]);

				interaction.editReply({ embeds: [new MessageEmbed().setTitle('Dropship!').setDescription(`You dropshipped the ${values[2]} for \`${values[1]}\` cents!`)] });
				await firestore.doc(`/users/${interaction.user.id}`).set(userData);

				return true;
			})
			.catch(async () => {
				await interaction.editReply({ embeds: [new MessageEmbed().setTitle('Dropship!').setDescription('Whoa, you took too long to respond!')] });
				return false;
			});

		return !accepted ? false : true;
	},
};
