// eslint-disable-next-line no-unused-vars
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, CommandInteraction } = require('discord.js');


module.exports = {
	name: 'hire',
	description: 'Information: how to hire my developer',
	usage: '/hire',

	cooldown: {
		time: 0,
		text: 'None (0)',
	},
	defer: {
		defer: true,
		ephemeral: false,
	},

	data: new SlashCommandBuilder()
		.setName('hire')
		.setDescription('Information: how to hire my developer!')
		.setDMPermission(true),

	/**
	 * @async @function
	 * @group Commands @subgroup Information
	 * @summary Shares details about the developers
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

		const embed = new EmbedBuilder()
			.setTitle('Hire the Dev!')
			.setDescription('Hey, my name is **Liam**, and I am a **professional software engineer** specializing in bot development.\n\nMy services include affordable bot development with speedy replies and delivery. With a track record of __developing 4 verified bots__, some of which have been used by over **[800,000 users](https://coinflipper.liamskinner.co.uk)**, I possess extensive experience in the field.\n\nAs a software engineer, I prioritize ensuring the quality of my work, and I guarantee complete satisfaction with the end result. I am confident in my ability to provide tailored solutions to meet your unique needs.\n\nThank you for considering my services, and please don\'t hesitate to reach out if you have any questions or if you would like to discuss your project further.\n\n**Email:** me@liamskinner.co.uk\n**Server:** [discord.gg/2je9aJynqt](https://discord.gg/2je9aJynqt) \n**Payment:** [PayPal](https://liamskinner.co.uk/donate)')
			.setColor('Blurple');

		/* Creates row of external link buttons */
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Website')
					.setURL('https://liamskinner.co.uk'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Support Server')
					.setURL('https://discord.gg/2je9aJynqt'),
			);

		/* Returns true to enable the cooldown */
		interaction.followUp({
			embeds: [embed],
			components: [row],
		});

		return true;
	},
};
