// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, CommandInteraction } = require('discord.js');

const { dropshipItems } = require('./../../util/constants');
const { database } = require('./../../util/functions');


module.exports = {
	name: 'dropship',
	description: 'Dropship an item and try to earn some cents!',
	usage: '/dropship',

	cooldown: {
		time: 60,
		text: '60 Seconds',
	},
	defer: {
		defer: true,
		ephemeral: true,
	},

	data: new SlashCommandBuilder()
		.setName('dropship')
		.setDescription('Dropship an item and try to earn some cents!')
		.setDMPermission(true),

	/**
	 * @async @function
	 * @group Commands @subgroup Currency
	 * @summary Minigame - earn money
	 * 
	 * @param {Object} param
	 * @param {CommandInteraction} param.interaction - DiscordJS Slash Command Object
	 * 
	 * @returns {Promise<boolean>} True (Success) - triggers cooldown.
	 * @returns {Promise<boolean>} False (Error) - skips cooldown.
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async ({ interaction }) => {

		const chance = Math.floor(Math.random() * 30);

		/* Set the winning values */
		const largeWin = Math.floor(Math.random() * (700 - 300 + 1)) + 300;
		const smallWinOne = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
		const smallWinTwo = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

		let list = [];
		if (chance > 20) {
			list = [largeWin, smallWinOne, smallWinTwo];
		}
		else if (chance > 10) {
			list = [smallWinOne, largeWin, smallWinTwo];
		}
		else {
			list = [smallWinOne, smallWinTwo, largeWin];
		}

		/* Create the buttons to choose from */
		const row = new ActionRowBuilder();
		for (const value of list) {
			const item = dropshipItems[Math.floor(Math.random() * dropshipItems.length)];
			row.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setLabel(item)
					.setCustomId(`dropship-${value}-${item}`),
			);
		}
		const embed = new EmbedBuilder()
			.setTitle('Dropship!')
			.setDescription('Select one of the items below.');

		const sentMessage = await interaction.followUp({
			embeds: [embed],
			components: [row],
		});

		if (!sentMessage) {
			return false;
		}

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

				await interaction
					.deleteReply()
					.catch();

				const buttonEmbed = new EmbedBuilder()
					.setTitle('Dropship!')
					.setDescription(`You dropshipped the ${values[2]} for \`${values[1]}\` cents!`);

				await button.reply({
					ephemeral: true,
					embeds: [buttonEmbed],
				});

				await database.setValue('users', interaction.user.id, userData);
				return true;
			})
			.catch(async () => {
				const timeoutEmbed = new EmbedBuilder()
					.setTitle('Dropship!')
					.setDescription('Whoa, you took too long to respond!')
					.setColor('Red');

				await interaction.editReply({
					embeds: [timeoutEmbed],
				});
				return false;
			});

		return (accepted
			? true
			: false
		);
	},
};
