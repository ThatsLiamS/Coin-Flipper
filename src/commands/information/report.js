/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
	name: 'report',
	description: 'Report a bug/issue to the developers!',
	usage: '`/report <description>`',

	permissions: [],
	guildOnly: true,

	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report a bug/issue to the developers!')
		.setDMPermission(false)

		.addStringOption(option => option
			.setName('description')
			.setDescription('Explain the issue you are having')
			.setRequired(true),
		),

	error: false,
	defer: false,

	/**
	 * Report a bug/issue to the developers.
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
		const webhook = new WebhookClient({ url: process.env['ReportWebhook'] });
		webhook.send({ username: interaction.guild.name, avatarURL, embeds: [embed] });

		/* Returns true to enable the cooldown */
		interaction.reply({ content: 'Thank you for helping us make Coin Flipper even better.', ephemeral: true });
		return true;
	},
};
