/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
	name: 'suggest',
	description: 'Suggest an improvement, command or feature!',
	usage: '`/suggest <description>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggest an improvement, command or feature!')
		.addStringOption(option => option
			.setName('description')
			.setDescription('Include a detailed description of your suggestion')
			.setRequired(true),
		),

	error: false,

	/**
	 * Suggest an improvement, command or feature.
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord Client object
	 * 
	 * @returns {boolean}
	**/
	execute: ({ interaction, client }) => {

		const avatarURL = interaction.guild.iconURL() ? interaction.guild.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setDescription(`**${client.user.tag}**\n${interaction.options.getString('description')}`)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setFooter({ text: `ID: ${interaction.member.id}` })
			.setTimestamp();

		/* Locate and send the webhook */
		const webhook = new WebhookClient({ url: process.env['SuggestionWebhook'] });
		webhook.send({ username: interaction.guild.name, avatarURL, embeds: [embed] });

		/* Returns true to enable the cooldown */
		interaction.followUp({ content: 'Your suggestion has been sent to my developers.', ephemeral: true });
		return true;
	},
};
