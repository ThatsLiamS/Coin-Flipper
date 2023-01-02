/* Impot required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { database } = require('./../../../util/functions.js');

module.exports = {
	name: 'status',
	description: 'Check your status and see how your items help you!',
	usage: '/status',

	permissions: [],
	guildOnly: false,
	cooldown: { time: 5, text: '5 Seconds' },

	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Check your status and see how your items help you!')
		.setDMPermission(true),

	error: false,
	defer: true,

	/**
	 * Check your status and see how your items help you.
	 *
	 * @param {object} interaction - Discord Slash Command object
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		const embed = new EmbedBuilder()
			.setTitle(`${interaction.user.username}'s Status:`)
			.setColor('Green');

		/* Fetch the values from the database */
		const userData = await database.getValue('users', interaction.user.id);

		if (userData.items.bronzecoin > 0) embed.addFields({ name: '🥉 Bronze Coin', value: 'Can use the PENNY addon (`/flip penny`)' });
		if (userData.items.silvercoin > 0) embed.addFields({ name: '🥈 Silver Coin', value: 'Can use the DIME addon (`/flip dime`)' });
		if (userData.items.goldcoin > 0) embed.addFields({ name: '🥇 Gold Coin', value: 'Can use the DOLLAR addon, value: which gives 1.5x more cents (`/flip dollar`)' });
		if (userData.items.kcoin > 0) embed.addFields({ name: '🏅 24k Gold Medal', value: 'Can use the 24 addon, value: which has a 5% greater chance to get a briefcase (`/flip 24`)' });
		if (userData.items.golddisk > 0) embed.addFields({ name: '📀 Gold Disk', value: 'Gives 2x more cents when flipping' });
		if (userData.items.platinumdisk > 0) embed.addFields({ name: '💿 Platinum Disk', value: `Gives 3x more cents when flipping${userData.items.golddisk > 0 ? ' (does not add onto the gold disk)' : ''}` });

		if (userData.items.luckypenny > 0) embed.addFields({ name: '🍀 Lucky Clover', value: 'Has a better chance of winning the lottery' });
		if (userData.items.packages > 0) embed.addFields({ name: '📦 Package', value: 'Gives more cents when dropshipping' });
		if (userData.items.compass > 0) embed.addFields({ name: '🧭 Compass', value: 'Has a better chance of getting cents when exploring' });
		if (userData.items.controller > 0) embed.addFields({ name: '🎮 Controller', value: 'Gives 5x more cents when winning minigames' });
		if (userData.items.hammer > 0) embed.addFields({ name: '⚒️ Hammer', value: 'Gives more cents and rocks when mining' });
		if (userData.items.label > 0) embed.addFields({ name: '🏷️ Label', value: 'Gives 10% more cents in your register' });
		if (userData.items.clipboard > 0) embed.addFields({ name: '📋 Clipboard', value: 'Gives 1.5x more cents when working' });


		/* return true to enable the cooldown */
		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
