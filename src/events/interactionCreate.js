/* Import required modules and files */
const { Collection, InteractionType } = require('discord.js');
const { formatTime } = require('./../util/functions.js');

/* Global variable definitions */
const cooldowns = new Collection();
const quotaExceeded = false;

module.exports = {
	name: 'interactionCreate',
	once: false,

	/**
	 * Triggered when an interaction is used.
	 *
	 * @param {object} interaction - Discord interaction object
	 * @param {object} client - Discord Client object
	 *
	 * @returns {void}
	**/
	execute: async (interaction, client) => {

		/* Is interaction a command? */
		if (interaction.type === InteractionType.ApplicationCommand) {

			const cmd = client.commands.get(interaction.commandName);
			if (!cmd) return;

			/* Is the database available? */
			if (quotaExceeded == true) {
				interaction.reply({ content: 'Sorry, we are experiencing some technical difficulties, please try again later.', ephemeral: true });
				return;
			}

			/* Is the command working? */
			if (cmd['error'] == true) {
				interaction.reply({ content: 'Sorry, this command is currently unavailable. Please try again later.', ephemeral: true });
				return;
			}

			if (cmd['permissions'] != []) {
				for (const permission of cmd['permissions']) {
					/* Loops through and check permissions agasint the user */
					if (!interaction.member.permissions.has(permission)) {
						interaction.reply({ content: 'Sorry, you do not have permission to run this command.', ephemeral: true });
						return;
					}
				}
			}

			/* Does the command need referring? */
			if (cmd['defer'] == true) await interaction.deferReply({ ephemeral: cmd['ephemeral'] ? true : false });


			/* Work out the appropriate cooldown time */
			if (!cooldowns.has(cmd.name)) cooldowns.set(cmd.name, new Collection());
			const timestamps = cooldowns.get(cmd.name);
			let cooldownAmount = (cmd.cooldown || 0) * 1000;

			if (cmd.name == 'flip' && interaction.channel.id == '832245298969182246') cooldownAmount = 0;

			if (timestamps.has(interaction.user.id)) {
				const expiration = Number(timestamps.get(interaction.user.id)) + Number(cooldownAmount);
				const secondsLeft = Math.floor((Number(expiration) - Number(Date.now())) / 1000);

				if (cmd['defer'] == true) await interaction.followUp({ content: `Please wait **${formatTime(secondsLeft > 1 ? secondsLeft : 1)}** to use that command again!` });
				else await interaction.reply({ content: `Please wait **${formatTime(secondsLeft > 1 ? secondsLeft : 1)}** to use that command again` });

				return false;
			}


			/* Execute the command file */
			cmd.execute({ interaction, client })

				.then((res) => {
					if (res == true) {
						/* Set and delete the cooldown */
						timestamps.set(interaction.user.id, Date.now());
						setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
					}
				})

				.catch((err) => {
					console.log(err);
				});

		}

	},
};
