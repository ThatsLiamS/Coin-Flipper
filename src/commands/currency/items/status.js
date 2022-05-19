const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'status',
	description: 'Check your status and see how items you have help you!',
	usage: '`/status`',

	permissions: [],
	ownerOnly: false,
	guildOnly: false,
	developerOnly: false,

	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Check your status and see how items you have help you!'),

	error: false,
	execute: async ({ interaction, userData }) => {

		const embed = new MessageEmbed()
			.setTitle(`${interaction.user.username}'s Status:`)
			.setColor('GREEN');

		if (userData.currencies.multiplier > 1) {
			embed.setDescription(`You have a general multiplier of ${userData.currencies.multiplier}!`);
		}

		if (userData.inv.bronzecoin > 0) embed.addField('🥉 Bronze Coin', 'Can use the PENNY addon (`/flip penny`)');
		if (userData.inv.silvercoin > 0) embed.addField('🥈 Silver Coin', 'Can use the DIME addon (`/flip dime`)');
		if (userData.inv.goldcoin > 0) embed.addField('🥇 Gold Coin', 'Can use the DOLLAR addon, which gives 1.5x more cents (`/flip dollar`)');
		if (userData.inv.kcoin > 0) embed.addField('🏅 24k Gold Medal', 'Can use the 24 addon, which has a 5% greater chance to get a briefcase (`/flip 24`)');
		if (userData.inv.golddisk > 0) embed.addField('📀 Gold Disk', 'Gives 2x more cents when flipping');
		if (userData.inv.platinumdisk > 0) embed.addField('💿 Platinum Disk', `Gives 3x more cents when flipping${userData.inv.golddisk > 0 ? ' (does not add onto the gold disk)' : ''}`);

		if (userData.inv.luckypenny > 0) embed.addField('🍀 Lucky Clover', 'Has a better chance of winning the lottery');
		if (userData.inv.packages > 0) embed.addField('📦 Package', 'Gives more cents when dropshipping');
		if (userData.inv.compass > 0) embed.addField('🧭 Compass', 'Has a better chance of getting cents when exploring');
		if (userData.inv.controller > 0) embed.addField('🎮 Controller', 'Gives 5x more cents when winning minigames');
		if (userData.inv.hammer > 0) embed.addField('⚒️ Hammer', 'Gives more cents and rocks when mining');
		if (userData.inv.label > 0) embed.addField('🏷️ Label', 'Gives 10% more cents in your register');
		if (userData.inv.clipboard > 0) embed.addField('📋 Clipboard', 'Gives 1.5x more cents when working');

		interaction.followUp({ embeds: [embed] });
		return true;
	},
};
