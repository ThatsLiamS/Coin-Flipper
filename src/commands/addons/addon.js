/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { database } = require('./../../util/functions.js');

module.exports = {
	name: 'addon',
	description: 'Collection of user-based, custom addons.',
	usage: '/addon view <name>\n/addon create <name>\n/addon rename <name> <newName>\n/addon delete <name>\n/addon setcost <name> <cost>\n/addon setdescription <name> <description>\n/addon inputs\n/addon addresponse <name> <response>\n/addon deleteresponse <name> <response>',

	cooldown: { time: 15, text: '15 Seconds' },
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('addon')
		.setDescription('Collection of user-based, custom addons.')
		.setDMPermission(true)

		.addSubcommand(subcommand => subcommand
			.setName('view').setDescription('View an addon and it\'s responses!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('create').setDescription('Create a new custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('rename').setDescription('Rename a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50))
			.addStringOption(option => option.setName('new_name').setDescription('What do you want the new name to be?').setRequired(true).setMaxLength(50)),
		)
		.addSubcommand(subcommand => subcommand
			.setName('delete').setDescription('Delete a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('setcost').setDescription('Set the price of a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50))
			.addIntegerOption(option => option.setName('cost').setDescription('How much for?').setRequired(true).setMaxValue(1500)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('setdescription').setDescription('Set the description of a custom addon!')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50))
			.addStringOption(option => option.setName('description').setDescription('What is the description?').setRequired(true).setMaxLength(200)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('inputs').setDescription('View all the custom values you can include in responses!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('addresponse').setDescription('Add a new response to a custom addon')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50))
			.addStringOption(option => option.setName('response').setDescription('What do you want the response to be?').setRequired(true).setMaxLength(200)),
		)

		.addSubcommand(subcommand => subcommand
			.setName('deleteresponse').setDescription('Delete a response of a custom addon')
			.addStringOption(option => option.setName('name').setDescription('What is the addon\'s name?').setRequired(true).setMaxLength(50))
			.addIntegerOption(option => option.setName('response').setDescription('Which response number?').setRequired(true)),
		),

	/**
	 * Collection of user-based, custom addons.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		/* Addon Name validation */
		const name = interaction.options.getString('name');
		if (!(subCommandName == 'inputs') && (name?.length > 50 || ['none', 'null', 'undefined', 'nan'].includes(name?.toLowerCase()) || name?.includes(' '))) {
			interaction.followUp({ content: 'That is an invalid addon name.' });
			return false;
		}

		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		/* Locate Addon object */
		const addon = userData.addons.filter((a) => a.name == name)[0];
		if (!addon && !(subCommandName == 'create' || subCommandName == 'inputs')) {
			interaction.followUp({ content: 'That is not a valid addon, use `/addon create` to create a new one.' });
			return false;
		}

		const embed = new EmbedBuilder().setTimestamp();

		if (subCommandName == 'view') {
			/* Create the message to send */
			const embeds = [embed];
			embed.setColor('Green').setTitle(`Addon ${addon.name}!`).setDescription(`**Description:** ${addon.description || 'this addon has no description'}\n**Cost:** ${addon.cost || 0} cents\n**Published:** ${addon.published ? 'yes' : 'no'}`);

			/* Format responses */
			let responses = [];
			for (let index = 0; index < addon.responses.length; index++) responses.push(`\`${index + 1}\`. ${addon.responses[index]}`);
			if (!responses || responses == []) responses = ['This addon has no responses'];

			/* Format Pages */
			const embedData = [];

			for (let x = 0; x < responses.length; x += 20) embedData.push(responses.slice(x, x + 20));
			for (let x = 0; x < embedData.length; x++) {
				embeds.push(new EmbedBuilder().setTitle(`Responses ${x + 1}/${embedData.length}`).setColor('Green').setTimestamp().setDescription(`${embedData[x].join('\n')}`));
			}

			/* Returns true to enable the cooldown */
			interaction.followUp({ embeds, ephemeral: true });
			return true;
		}


		if (subCommandName == 'create') {
			/* Create the addon object */
			const newAddon = {
				name, cost: 0, description: '', author: interaction.user.id, published: false,
				responses: ['The coin landed on heads', 'The coin landed on tails'],
			};

			/* Is there an avaliable addon */
			if (userData.addons.length > 3) {
				interaction.followUp({ content: 'You have no avaliable addons. To clear up space, do "/addon delete".' });
				return false;
			}
			userData.addons.push(newAddon);

			/* Create the message to send */
			embed.setColor('Green').setTitle('New Addon Created!').setDescription(`You've successfully created the **${name}** addon!`)
				.setFooter({ text: 'Use "/addon addresponse" to add new responses.' });
		}

		if (subCommandName == 'rename') {
			/* Is the new name valid */
			const newName = interaction.options.getString('new_name');
			if (newName.length > 50 || ['none', 'null', 'undefined', 'nan'].includes(newName.toLowerCase()) || newName.includes(' ')) {
				interaction.followUp({ content: 'That is an invalid addon name.' });
				return true;
			}

			/* Set the new name */
			addon.name = newName;

			/* Create the message to send */
			embed.setColor('Green').setTitle('Renamed Addon!').setDescription(`You've successfully renamed **${name}** to **${newName}**!`);
		}

		if (subCommandName == 'delete') {
			/* delete the addon */
			userData.addons = userData.addons.filter((a) => a.name != name) ?? [];

			/* Create the message to send */
			embed.setColor('Red').setTitle('Deleted Addon!').setDescription(`You've successfully deleted **${name}**!\nThis action cannot be reversed.`);
		}

		if (subCommandName == 'setcost') {
			/* What price for it? */
			const newCost = interaction.options.getInteger('cost');

			/* Pricing limits */
			if (newCost > 500 && userData.stats.donator == 0) {
				interaction.followUp({ content: 'Sorry, you cannot set it higher than 500 cents. To raise the limit to 1,500 cents, consider being a donator.' });
				return false;
			}
			if (newCost > 1500) {
				interaction.followUp({ content: 'Sorry, you cannot set it higher than 1500 cents.' });
				return false;
			}

			/* Add the values to the database */
			const oldCost = addon.cost || 0;
			addon.cost = newCost;

			/* Create the message to send */
			embed.setColor('Green').setTitle('Changed the Addon Price!').setDescription(`You've successfully changed **${name}**'s price from \`${oldCost}\` to **${newCost} cents**.`);
		}

		if (subCommandName == 'setdescription') {
			/* What is the new Description */
			const newDesc = interaction.options.getString('description');

			/* Description length limits */
			if (newDesc.length > 100) {
				interaction.followUp({ content: 'Sorry, that description is too long. It can\'t be longer than 100 characters.' });
				return false;
			}

			/* Add the values to the database */
			const oldDesc = addon.description || 'No Description';
			addon.description = newDesc;

			/* Create the message to send */
			embed.setColor('Green').setTitle('Changed the Addon Description!').setDescription(`You've successfully changed **${name}**'s description from \`${oldDesc}\` to **${newDesc}**.`);
		}

		if (subCommandName == 'inputs') {
			/* Create the message to send */
			embed.setColor('#cd7f32').setTitle('Addon Inputs!').setFooter({ text: 'Remember these when you use "/addon addresponse"' })
				.setDescription('**{cents}**  - The user\'s main balance\n**{register}**  - The user\'s balance within their register\n**{donator}**  - The user\'s donator status/tier (or \'none\')\n**{job}**  - The user\'s current job (or \'none\')\n**{flipped}**  - The number of coins the user flipped\n**{minigames}**  - The number of minigames the user has won');

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'addresponse') {
			/* is the response valid */
			const response = interaction.options.getString('response');
			if (response.length > 200) {
				interaction.followUp({ content: `Your response was too long, ${response.length - 200} characters over the 200 char limit.` });
				return false;
			}

			/* Is it already a response */
			addon?.responses ? addon.responses : [];

			const found = addon.responses.filter(a => a.toLowerCase() == response.toLowerCase())[0];
			if (found) {
				interaction.followUp({ content: 'That is already a response.' });
				return false;
			}
			addon.responses.push(response);

			/* Create the message to send */
			embed.setColor('Green').setTitle('New Response Added!').setDescription(`You successfully added **${response}** to **${name}**!\nIt now has ${addon.responses.length} responses.`)
				.setFooter({ text: 'Remember to check out "/addon inputs" to include custom values' });
		}

		if (subCommandName == 'deleteresponse') {
			/* is the response valid */
			const index = Number(interaction.options.getInteger('response') - 1);
			if (index < 0 || !addon?.responses || !addon.responses[index]) {
				interaction.followUp({ content: 'That is not a valid response.' });
				return false;
			}

			/* remove the selected response */
			const response = addon.responses[index];
			addon.responses.splice(index, 1);

			/* Create a message to send */
			embed.setColor('Red').setTitle('Response Deleted').setDescription(`Successfully deleted the response: **${response}**.\nThis action cannot be reversed.`);
		}

		/* Response to user, and set values in the database */
		interaction.followUp({ embeds: [embed] });

		await database.setValue('users', interaction.user.id, userData);
		return true;

	},
};
