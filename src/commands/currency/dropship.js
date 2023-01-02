/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { dropshipItems } = require('./../../util/constants.js');
const { database } = require('./../../util/functions.js');

module.exports = {
	name: 'dropship',
	description: 'Dropship an item and try to earn some cents!',
	usage: '/dropship',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 60, text: '60 Seconds' },

	data: new SlashCommandBuilder()
		.setName('dropship')
		.setDescription('Dropship an item and try to earn some cents!')
		.setDMPermission(true),

	error: false,
	defer: true,

	/**
	 * Dropship an item and try to earn some cents.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		const chance = Math.floor(Math.random() * 30);

		/* Set the winning values */
		const largeWin = Math.floor(Math.random() * (700 - 300 + 1)) + 300;
		const smallWinOne = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
		const smallWinTwo = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

		let list = [];
		if (chance > 20) list = [largeWin, smallWinOne, smallWinTwo];
		else if (chance > 10) list = [smallWinOne, largeWin, smallWinTwo];
		else list = [smallWinOne, smallWinTwo, largeWin];

		/* Create the buttons to choose from */
		const row = new ActionRowBuilder();
		for (const value of list) {
			const item = dropshipItems[Math.floor(Math.random() * dropshipItems.length)];
			row.addComponents(
				new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel(item).setCustomId(`dropship-${value}-${item}`),
			);
		}
		const embed = new EmbedBuilder()
			.setTitle('Dropship!')
			.setDescription('Select one of the items below.');

		const sentMessage = await interaction.followUp({ embeds: [embed], components: [row] });
		if (!sentMessage) return false;

		/* Await for a button to be pressed */
		const filter = (button) => button.customId.startsWith('dropship-') && button.user.id === interaction.user.id;
		const accepted = await interaction.channel.awaitMessageComponent({ filter, time: 45_000, componentType: 2 })
			.then(async (button) => {

				/* Fetch the user's data */
				const userData = await database.getValue('users', interaction.user.id);

				/* Award the prize to the user */
				const values = button.customId.split('-');
				userData.stats.balance = Number(userData.stats.balance) + Number(values[1]);
				userData.stats.lifeEarnings = Number(userData.stats.lifeEarnings) + Number(values[1]);

				interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Dropship!').setDescription(`You dropshipped the ${values[2]} for \`${values[1]}\` cents!`)] });

				await database.setValue('users', interaction.user.id, userData);
				return true;
			})
			.catch(async () => {
				await interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Dropship!').setDescription('Whoa, you took too long to respond!').setColor('Red')] });
				return false;
			});

		return (accepted ? true : false);

	},
};
