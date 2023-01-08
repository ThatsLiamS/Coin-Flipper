/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist, joblist, badgelist } = require('./../../util/constants.js');
const { database } = require('./../../util/functions.js');

module.exports = {
	name: 'balance',
	description: 'View a user\'s balance!',
	usage: '/balance [user]',

	cooldown: { time: 5, text: '5 Seconds' },
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('View a user\'s balance!')
		.setDMPermission(true)

		.addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(false)),

	/**
	 * View a user's balance.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		/* Grab the user's information */
		const user = interaction.options.getUser('user') || interaction.user;
		const userData = await database.getValue('users', user.id);

		const embed = new EmbedBuilder()
			.setColor('Orange')
			.setTitle(`${user.username}'s Balance!`);

		/* Are they on compact mode? */
		if (userData.settings.compact == true) {
			embed.setDescription(`Cents: \`${userData?.stats.balance || 0}\`\nRegister: \`${userData?.stats.bank || 0}\``);

			interaction.followUp({ embeds: [embed] });
			return true;
		}


		/* Sort and organise the user's badges */
		const badges = [];
		for (const badge of badgelist) {
			if (userData.badges[badge.id] == true && !(userData.badges[badge.id + '_plus'] == true)) badges.push(`${badge.prof}`);
		}
		if (userData.stats.donator == 1) badges.push(`${badgelist.filter(b => b.id == 'gold_tier')[0].prof}`);
		if (userData.stats.donator == 2) badges.push(`${badgelist.filter(b => b.id == 'platinum_tier')[0].prof}`);
		if (badges.length == 0) badges.push('There are no badges');


		/* Sort and organise the user's items */
		const items = [];
		for (const item of itemlist) {
			if (userData?.items[item.id] > 0) items.push(`${item.prof}${userData?.items[item.id] > 1 ? ` (${userData?.items[item.id]})` : ''}`);
		}
		if (userData?.settings?.developer == true) items.push('🧰 toolbox');
		if (items.length == 0) items.push('There\'s nothing here');

		/* Do they have a job? */
		const jobObject = joblist.filter(job => job.name.toLowerCase() == userData?.stats.job?.toLowerCase())[0];
		const job = jobObject?.emoji ? `${jobObject.emoji} ${jobObject.name}` : 'none';

		if (userData?.stats?.bio) embed.setDescription(userData.stats.bio);
		embed.addFields(
			{ name: 'Cents', value: `${userData?.stats?.balance || 0}` },
			{ name: 'Inventory', value: items.join('\n') },
			{ name: 'Job', value: `${job}` },

			{ name: 'Coins Flipped', value: `${userData?.stats?.flips || 0}` },
			{ name: 'Minigames Won', value: `${userData?.stats?.minigames || 0}` },
			{ name: 'Badges', value: badges.join('\n') },
		);

		/* return true to enable the cooldown */
		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
