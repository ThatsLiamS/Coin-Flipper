/* Impot required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'status',
	description: 'Check your status and see how your items help you!',
	usage: '`/status`',

	permissions: [],
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Check your status and see how your items help you!')
		.setDMPermission(true),

	error: false,

	/**
	 * Check your status and see how your items help you.
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * @param {object} userData - Discord User's data/information
	 * 
	 * @returns {boolean}
	**/
	execute: async ({ interaction, userData }) => {

		const embed = new EmbedBuilder()
			.setTitle(`${interaction.user.username}'s Status:`)
			.setColor('Green');

		if (userData.currencies.multiplier > 1) {
			embed.setDescription(`You have a general multiplier of ${userData.currencies.multiplier}!`);
		}

		if (userData.inv.bronzecoin > 0) embed.addFields({ name: '🥉 Bronze Coin', value: 'Can use the PENNY addon (`/flip penny`)' });
		if (userData.inv.silvercoin > 0) embed.addFields({ name: '🥈 Silver Coin', value: 'Can use the DIME addon (`/flip dime`)' });
		if (userData.inv.goldcoin > 0) embed.addFields({ name: '🥇 Gold Coin', value: 'Can use the DOLLAR addon, value: which gives 1.5x more cents (`/flip dollar`)' });
		if (userData.inv.kcoin > 0) embed.addFields({ name: '🏅 24k Gold Medal', value: 'Can use the 24 addon, value: which has a 5% greater chance to get a briefcase (`/flip 24`)' });
		if (userData.inv.golddisk > 0) embed.addFields({ name: '📀 Gold Disk', value: 'Gives 2x more cents when flipping' });
		if (userData.inv.platinumdisk > 0) embed.addFields({ name: '💿 Platinum Disk', value: `Gives 3x more cents when flipping${userData.inv.golddisk > 0 ? ' (does not add onto the gold disk)' : ''}` });

		if (userData.inv.luckypenny > 0) embed.addFields({ name: '🍀 Lucky Clover', value: 'Has a better chance of winning the lottery' });
		if (userData.inv.packages > 0) embed.addFields({ name: '📦 Package', value: 'Gives more cents when dropshipping' });
		if (userData.inv.compass > 0) embed.addFields({ name: '🧭 Compass', value: 'Has a better chance of getting cents when exploring' });
		if (userData.inv.controller > 0) embed.addFields({ name: '🎮 Controller', value: 'Gives 5x more cents when winning minigames' });
		if (userData.inv.hammer > 0) embed.addFields({ name: '⚒️ Hammer', value: 'Gives more cents and rocks when mining' });
		if (userData.inv.label > 0) embed.addFields({ name: '🏷️ Label', value: 'Gives 10% more cents in your register' });
		if (userData.inv.clipboard > 0) embed.addFields({ name: '📋 Clipboard', value: 'Gives 1.5x more cents when working' });


		/* return true to enable the cooldown */
		interaction.followUp({ embeds: [embed] });
		return true;
	},
};
