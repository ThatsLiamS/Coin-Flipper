const fs = require('fs');

// eslint-disable-next-line no-unused-vars
const { Collection, Client } = require('discord.js');


module.exports = {
	name: 'ready',
	once: true,

	/**
	 * @async @function
	 * @group Events
	 * @summary Automatic bot set up (triggered once)
	 * 
	 * @param {Client} client - DiscordJS Bot Client Object
	 * 
	 * @returns {Promise<boolean>} True (Success)
	 * @returns {Promise<boolean>} False (Error)
	 * 
	 * @author Liam Skinner <me@liamskinner.co.uk>
	**/
	execute: async (client) => {

		console.log(`Shard ${client.shard.ids}/${client.shard.count} ready`);

		/* Set client status */
		client.user.setPresence({
			status: 'online',
			activities: [{
				type: 3,
				name: `coins flip in ${client.shard.count} shards`,
			}],
		});

		/* Registering slash commands */
		client.commands = new Collection();
		const data = [];

		const categories = fs.readdirSync(`${__dirname}/../commands/`);
		for (const category of categories) {
			const commandFolders = fs.readdirSync(`${__dirname}/../commands/${category}`).filter(file => !file.endsWith('.js'));
			if (commandFolders) {
				for (const subCommandFolders of commandFolders) {
					const commandFiles = fs.readdirSync(`${__dirname}/../commands/${category}/${subCommandFolders}`).filter(file => file.endsWith('.js'));

					for (const file of commandFiles) {
						// eslint-disable-next-line security/detect-non-literal-require
						const command = require(`${__dirname}/../commands/${category}/${subCommandFolders}/${file}`);
						client.commands.set(command.name, command);
						data.push(command.data.toJSON());
					}

				}
			}
			const commandFiles = fs.readdirSync(`${__dirname}/../commands/${category}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {

				// eslint-disable-next-line security/detect-non-literal-require
				const command = require(`${__dirname}/../commands/${category}/${file}`);
				client.commands.set(command.name, command);
				data.push(command.data.toJSON());

			}

		}

		/* Set ApplicationCommand data */
		await client.application.commands.set(data);
		return true;
	},
};
