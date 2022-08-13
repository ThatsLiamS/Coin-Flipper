/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist, badgelist } = require('./../../../util/constants.js');

module.exports = {
	name: 'badges',
	description: 'View and claim badges!',
	usage: '`/badges list`\n`/badges claim <badge>`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('badges')
		.setDescription('View and claim badges!')

		.addSubcommand(subcommand => subcommand
			.setName('list')
			.setDescription('View the badges you can earn!'),
		)

		.addSubcommand(subcommand => subcommand
			.setName('claim')
			.setDescription('Claim a badge to show off on your profile!')
			.addStringOption(option => option.setName('badge').setDescription('Select a badge').setRequired(true).addChoices(
				{ 'name': 'Supporter', 'value': 'support' }, { 'name': 'Flipper', 'value': 'flip' },
				{ 'name': 'Avid Flipper', 'value': 'flip_pro' }, { 'name': 'Gamer', 'value': 'minigame' },
				{ 'name': 'Pro Gamer', 'value': 'minigame_plus' }, { 'name': 'Registered', 'value': 'register' },
				{ 'name': 'Collector', 'value': 'collector' }, { 'name': 'Scavenger', 'value': 'collector_pro' },
				{ 'name': 'Wealthy', 'value': 'rich' }, { 'name': 'Millionaire', 'value': 'rich_pro' },
			)),
		),

	error: false,

	/**
	 * View and claim badges.
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} firestore - Firestore database object
	 * @param {object} userData - Discord User's data/information
	 * 
	 * @returns {boolean}
	**/
	execute: async ({ interaction, firestore, userData }) => {

		/* Retrieve sub command option */
		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

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
			for (const badge of badges) embed.addFields({ name: badge.prof, value: badge.req });

			/* Response to user, and return true to enable cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'claim') {
			const badgeId = interaction.options.getString('badge');
			/* Already claimed badge */
			if (userData.badges[badgeId] == true) {
				interaction.followUp({ content: 'You have already claimed that badge! ' });
				return false;
			}

			/* Locate badge object */
			const badge = badgelist.filter((b) => b.id == badgeId);
			if (!badge.condition) {
				interaction.followUp({ content: 'You can not claim this badge.' });
				return false;
			}

			/* Compare badge requirements */
			const [type, compare, value] = badge.condition;
			let allowed = false;
			if (type == 'support') {
				if (interaction.guild.id != '821152669141565480' && interaction.guild.id != '832245298578849822') {
					interaction.followUp({ content: 'This command needs to be ran in the support server.' });
					return false;
				}
			}
			else if (type == 'collection') {

				let total = 0;
				itemlist.map((i) => total = total + (userData.inv[i.id] || 0));

				allowed = (total > value);
			}
			else if (type == 'niceness') {

				allowed = (userData.giveData.users > 5 && userData.giveData.cents > 100_000);
			}
			else {
				if (compare == '>') allowed = (userData[type] > value);
				if (compare == '=') allowed = (userData[type] == value);
				if (compare == '<') allowed = (userData[type] < value);
			}
			/* Reject the claim */
			if (allowed != true) {
				interaction.followUp({ content: `You do not meet the requirements for this badge.${badge.req}!` });
				return false;
			}

			interaction.followUp({ content: `You have claimed: ${badge.prof}!` });

			/* Update firestore database */
			userData.badges[badge.id] = true;
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);

			/* Return true to enable the cooldown */
			return true;
		}

		return false;


	},
};
