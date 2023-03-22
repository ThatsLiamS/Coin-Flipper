/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist, badgelist } = require('./../../../util/constants.js');
const { database } = require('./../../../util/functions.js');

module.exports = {
	name: 'badges',
	description: 'View and claim badges!',
	usage: '/badges list\n/badges claim <badge>',

	cooldown: { time: 5, text: '5 Seconds' },
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('badges')
		.setDescription('View and claim badges!')
		.setDMPermission(true)

		.addSubcommand(subcommand => subcommand
			.setName('list').setDescription('View the badges you can earn!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('claim').setDescription('Claim a badge to show off on your profile!')
			.addStringOption(option => option.setName('badge').setDescription('Select a badge').setRequired(true).addChoices(
				{ 'name': 'Supporter', 'value': 'support' }, { 'name': 'Flipper', 'value': 'flip' },
				{ 'name': 'Avid Flipper', 'value': 'flip_plus' }, { 'name': 'Gamer', 'value': 'minigame' },
				{ 'name': 'Pro Gamer', 'value': 'minigame_plus' }, { 'name': 'Registered', 'value': 'register' },
				{ 'name': 'Collector', 'value': 'collector' }, { 'name': 'Scavenger', 'value': 'collector_plus' },
				{ 'name': 'Wealthy', 'value': 'rich' }, { 'name': 'Millionaire', 'value': 'rich_plus' },
			)),
		),

	/**
	 * View and claim badges.
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
		/* Fetch the user's data */
		const userData = await database.getValue('users', interaction.user.id);

		if (subCommandName == 'list') {

			const embed = new EmbedBuilder()
				.setTitle('Badges:')
				.setColor('#54fff1')
				.setFooter({ text: 'Use "/badges claim <badge>" to claim a badge!\nThanks to X-Boy742#8981 for making the badges.' });

			/* Filter all unclaimed badges */
			const badges = badgelist.filter((b) => {
				if (userData.badges[b.id] == true) return undefined;

				if (b.id.endsWith('_plus')) {
					const newId = b.id.slice(0, b.id.length - 5);
					if (userData.badges[newId] == false) return undefined;
				}

				return true;
			});
			if (!badges || badges == []) embed.setDescription('Looks like you have claimed all the badges!');
			for (const badge of badges) embed.addFields({ name: badge.prof, value: badge.req, inline: true });

			/* Response to user, and return true to enable cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'claim') {
			const badgeId = interaction.options.getString('badge');

			/* Locate badge object */
			const badge = badgelist.filter((b) => b.id == badgeId)[0];
			if (!badge || !badge.condition) {
				interaction.followUp({ content: `You can not claim this badge. ${badge.condition}` });
				return false;
			}

			/* Already claimed badge */
			if (userData.badges[badgeId] == true) {
				interaction.followUp({ content: 'You have already claimed that badge! ' });
				return false;
			}

			/* Compare badge requirements */
			const [type, compare, value] = badge.condition.split('|');
			let allowed = false;
			if (type == 'support') {
				if (interaction?.guild?.id != '821152669141565480') {
					interaction.followUp({ content: 'This command needs to be ran in the support server.' });
					return false;
				}
				allowed = true;
			}
			else if (type == 'collection') {

				let total = 0;
				itemlist.map((i) => total = total + (userData.items[i.id] || 0));
				allowed = (total > value);
			}
			else if (type == 'niceness') {
				allowed = (userData.stats.given > 5 && userData.stats.given > 100_000);
			}
			else {

				let ConditionData = userData; type.split('.').map(field => ConditionData = ConditionData[field]);

				if (compare == '>') allowed = (ConditionData > Number(value));
				if (compare == '=') allowed = (ConditionData == Number(value));
				if (compare == '<') allowed = (ConditionData < Number(value));
			}
			/* Reject the claim */
			if (allowed != true) {
				interaction.followUp({ content: `You do not meet the requirements for this badge. ${badge.req}!` });
				return false;
			}

			interaction.followUp({ content: `You have claimed: ${badge.prof}!` });

			/* Update the database */
			userData.badges[badge.id] = true;
			await database.setValue('users', interaction.user.id, userData);
			return true;
		}

		return false;

	},
};
