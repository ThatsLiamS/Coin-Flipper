/* Import required modules and files */
const { SlashCommandBuilder, EmbedBuilder, WebhookClient, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const format = (string) => string.split('\n').map((line) => '> ' + line).join('\n');

module.exports = {
	name: 'suggest',
	description: 'Suggest an improvement, command or feature!',
	usage: '/suggest',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 10 * 60, text: '10 Minutes' },

	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggest an improvement, command or feature!')
		.setDMPermission(true),

	error: false,
	defer: false,

	/**
	 * Submit a bug report to the developers.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} client - Discord Client object
	 *
	 * @returns {boolean}
	**/
	execute: async ({ interaction, client }) => {

		/* Create modal to display */
		const modalPopup = new ModalBuilder()
			.setCustomId(`report-${interaction.user.id}-${client.user.id}`).setTitle('Coin Flipper\'s Bug Report!');

		/* Add input fields */
		const title = new ActionRowBuilder().addComponents(
			new TextInputBuilder().setCustomId('title').setLabel('Short title')
				.setStyle(TextInputStyle.Short).setMaxLength(150).setMinLength(5),
		);
		const description = new ActionRowBuilder().addComponents(
			new TextInputBuilder().setCustomId('description').setLabel('A clear and concise description')
				.setStyle(TextInputStyle.Paragraph).setMaxLength(2000).setMinLength(50),
		);
		const reproduce = new ActionRowBuilder().addComponents(
			new TextInputBuilder().setCustomId('solve').setLabel('Does this solve a bug?')
				.setStyle(TextInputStyle.Paragraph).setMaxLength(1000).setMinLength(2)
				.setPlaceholder('Yes, it always frustrates me when [....]'),
		);

		/* Display the modal */
		modalPopup.addComponents(title, description, reproduce);
		await interaction.showModal(modalPopup);

		/* Get the responses */
		const filter = (modal) => modal.customId === `report-${interaction.user.id}-${client.user.id}`;
		const res = interaction.awaitModalSubmit({ filter, time: 150_000 })
			.then(async (modal) => {

				await modal.deferReply({ ephemeral: true });

				const embed = new EmbedBuilder()
					.setColor('#0099ff')
					.setTitle(`${modal.fields.getTextInputValue('title')}`)
					.setDescription(`**Description:**\n${format(modal.fields.getTextInputValue('description'))}`)
					.setAuthor({ name: modal.user.username, iconURL: modal.user.displayAvatarURL() })
					.setFooter({ text: `User ID: ${modal.member.id}` })
					.setTimestamp();

				if (modal.fields.getTextInputValue('description')) {
					embed.addFields({ name: '__Does it solve a bug?__', value: `${format(modal.fields.getTextInputValue('solve'))}` });
				}

				/* Locate and send the webhook */
				const webhook = new WebhookClient({ url: process.env['SuggestionWebhook'] });
				webhook.send({ username: client.user.username, avatarURL: client.user.displayAvatarURL(), embeds: [embed] });

				/* Returns true to enable the cooldown */
				modal.followUp({ content: 'Thank you, your suggest has been sent to our developers', ephemeral: true });
				return true;

			})
			/* If they didn't response */
			.catch(async () => {
				await interaction.followUp({ content: 'Sorry, you took too long to repond.' });
				return false;
			});

		/* Returns boolean to enable the cooldown */
		return res;
	},
};
