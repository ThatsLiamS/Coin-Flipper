const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
	name: 'report',
	description: 'Report a bug/issue to the developers!',
	usage: '`/report <description>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report a bug/issue to the developers!')
		.addStringOption(option => option
			.setName('description')
			.setDescription('Explain the issue you are having')
			.setRequired(true),
		),

	error: false,
	execute: ({ interaction, client }) => {

		const avatarURL = interaction.guild.iconURL() ? interaction.guild.iconURL() : 'https://i.imgur.com/yLv2YVnh.jpg';
		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setDescription(`**${client.user.tag}**\n${interaction.options.getString('description')}`)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setFooter({ text: `ID: ${interaction.member.id}` })
			.setTimestamp();

		const webhook = new WebhookClient({ url: process.env['ReportWebhook'] });
		webhook.send({ username: interaction.guild.name, avatarURL, embeds: [embed] });

		interaction.followUp({ content: 'Thank you for helping us make Coin Flipper even better.', ephemeral: true });
	},
};
