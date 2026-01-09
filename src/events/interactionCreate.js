// eslint-disable-next-line no-unused-vars
const { Collection, InteractionType, Interaction, Client } = require('discord.js');

const { formatTime } = require('./../util/functions');


/* Global variable definitions */
const cooldowns = new Collection();

module.exports = {
	name: 'interactionCreate',
	once: false,

	/**
	 * @async @function
	 * @group Events
	 * @summary Handles all interations
	 * 
	 * @param {Interaction} interaction - DiscordJS Guild Object
	 * @param {Client} client - DiscordJS Bot Client Object
	 * 
	 * @returns {Promise<boolean>} True (Success)
	 * @returns {Promise<boolean>} False (Error)
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async (interaction, client) => {

		/* Is the database available? */
		const quotaExceeded = false;
		if (quotaExceeded === true) {
			interaction.reply({
				content: 'Sorry, we are experiencing some technical difficulties, please try again later.',
				ephemeral: true,
			});
			return false;
		}

		/* Is interaction a command? */
		if (interaction.type === InteractionType.ApplicationCommand) {

			const cmd = client.commands.get(interaction.commandName);
			if (!cmd) {
				interaction.reply({
					content: 'Sorry, this command is currently unavailable. Please try again later.',
					ephemeral: true,
				});
				return false;
			}

			/* Is the command working? */
			if (cmd['error'] === true) {
				interaction.reply({
					content: 'Sorry, this command is currently unavailable. Please try again later.',
					ephemeral: true,
				});
				return false;
			}

			/* Does the command need referring? */
			if (cmd?.defer?.defer === true) {
				await interaction.deferReply({
					ephemeral: cmd.defer.ephemeral
						? true
						: false,
				});
			}


			/* Work out the appropriate cooldown time */
			if (!cooldowns.has(cmd.name)) {
				cooldowns.set(cmd.name, new Collection());
			}
			const timestamps = cooldowns.get(cmd.name);

			let cooldownAmount = (cmd?.cooldown?.time || 0) * 1000;
			if (cmd.name === 'flip' && interaction.channel.id === '832245298969182246') {
				cooldownAmount = 0;
			}

			if (timestamps.has(interaction.user.id)) {
				const expiration = Number(timestamps.get(interaction.user.id)) + Number(cooldownAmount);
				const secondsLeft = Math.floor((Number(expiration) - Number(Date.now())) / 1000);

				if (cmd?.defer?.defer === true) {
					await interaction.followUp({
						content: `Please wait **${formatTime(secondsLeft > 1 ? secondsLeft : 1)}** to use that command again!`,
					});
				} else {
					await interaction.reply({
						content: `Please wait **${formatTime(secondsLeft > 1 ? secondsLeft : 1)}** to use that command again`,
					});
				}

				return false;
			}


			/* Execute the command file */
			cmd.execute({ interaction, client })

				.then((res) => {
					if (res === true) {
						/* Set and delete the cooldown */
						timestamps.set(interaction.user.id, Date.now());
						setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
					}
				})
				.catch();

			return true;
		}
	},
};
