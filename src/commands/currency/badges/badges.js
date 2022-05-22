const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

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
			.addStringOption(option => option.setName('badge').setDescription('Select a badge').setRequired(true))
			.addChoice('Supporter', 'support').addChoice('Flipper', 'flip').addChoice('Avid Flipper', 'flip_pro')
			.addChoice('Gamer', 'minigame').addChoice('Pro Gamer', 'minigame_plus').addChoice('Registered', 'register')
			.addChoice('Collector', 'collector').addChoice('Scavenger', 'collector_pro').addChoice('Wealthy', 'rich').addChoice('Millionaire', 'rich_pro'),
		),

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const subCommandName = interaction.options.getSubcommand();
		if (!subCommandName) {
			interaction.followUp({ content: 'Woah, an unexpected error has occurred. Please try again!' });
			return false;
		}

		if (subCommandName == 'list') {

			const embed = new MessageEmbed()
				.setTitle('Badges:')
				.setColor('#54fff1')
				.setFooter({ text: 'Use "/badges claim <badge>" to claim a badge!\nThanks to X-Boy742#8981 for making the badges.' });

			const badges = badgelist.map((b) => {
				if (userData.badges[b.id] == true) return undefined;

				if (b.id.endsWith('_plus')) {
					const newId = b.id.slice(0, b.id.length - 5);
					if (userData.badges[newId] == false) return undefined;
				}

				return b;
			});
			if (!badges || badges == []) embed.setDescription('Looks like you have claimed all the badges!');
			for (const badge of badges) embed.addField(badge.prof, badge.req);

			interaction.followUp({ embeds: [embed] });
			return true;
		}

		if (subCommandName == 'claim') {
			const badgeId = interaction.options.getString('badge');

			if (userData.badges[badgeId] == true) {
				interaction.followUp({ content: 'You have already claimed that badge! ' });
				return false;
			}

			const badge = badgelist.filter((b) => b.id == badgeId);
			if (!badge.condition) {
				interaction.followUp({ content: 'You can not claim this badge.' });
				return false;
			}

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
				if (compare == '=') allowed = (userData[type] = value);
				if (compare == '<') allowed = (userData[type] < value);
			}
			if (allowed != true) {
				interaction.followUp({ content: `You do not meet the requirements for this badge.${badge.req}!` });
				return false;
			}

			interaction.followUp({ content: `You have claimed: ${badge.prof}!` });

			userData.badges[badge.id] = true;
			await firestore.doc(`/users/${interaction.user.id}`).set(userData);
			return true;
		}

		return false;


	},
};
