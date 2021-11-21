const { MessageEmbed } = require('discord.js');

const check = require('./../../tools/check');
const itemlist = require('./../../tools/constants').itemlist;
const badgeEmotes = require('./../../tools/badgeEmotes');

const badge_list = [
	`${badgeEmotes.developer} Developer`,
	`${badgeEmotes.partnered_dev} Partnered Dev`,
	`${badgeEmotes.supporter} Supporter`,
	`${badgeEmotes.flipper} Flipper`,
	`${badgeEmotes.avid_flipper} Avid Flipper`,
	`${badgeEmotes.gamer} Gamer`,
	`${badgeEmotes.pro_gamer} Pro Gamer`,
	`${badgeEmotes.registered} Registered`,
	`${badgeEmotes.collector} Collector`,
	`${badgeEmotes.scavenger} Scavenger`,
	`${badgeEmotes.wealthy} Wealthy`,
	`${badgeEmotes.millionaire} Millionaire`,
	`${badgeEmotes.niceness} Niceness`,
	`${badgeEmotes.bug_hunter} Bug Hunter`,
	`${badgeEmotes.bug_poacher} Bug Poacher`,
	`${badgeEmotes.gold_tier} Gold Tier`,
	`${badgeEmotes.platinum_tier} Platinum Tier`
];


module.exports = {
	name: 'balance',
	description: 'Allows you to check your balance or the balance of another user.',

	myPermissions: ['Send Messages', 'Embed Links'],
	userPermissions: [],

	options: [
		{ name: 'member', description: 'Check a member\'s balance.', type: 'USER', required: false },
	],

	execute: async (interaction, firebase) => {

		const user = interaction.options.getUser('member') || interaction.member.user;
		if (user.bot) {
			return interaction.followUp({ content: "Bots don't have ~~sense~~ cents" });
		}

		if (user.id != interaction.member.id) await check(firebase, user.id);

		const userdata = await firebase.doc(`/users/${user.id}`).get();
		const userData = userdata.data();

		const bal = userData.currencies.cents;

		if (userData.compact === true) {

			const embed = new MessageEmbed()
				.setTitle(`${user.username}'s Balance:`)
				.setDescription(userData.stats.bio ? `${userData.stats.bio}\n` : '' + `Cents: \`${bal}\`` + userData.inv.key > 0 ? `\nRegister: \`${userData.currencies.register}\`` : '')
				.setColor("ORANGE");

			interaction.followUp({ embeds: [embed] });

			if (isNaN(bal) || bal == Infinity || bal == undefined) {
				interaction.channel.send({ content: "Hey, it looks like you have a bug in your balance! Please report it in the support server by doing `c!support` so we can make the bot better!" });
			}
			return;
		}

		const inv = userData.inv;
		let inventory = [];
		for (const item of itemlist) {
			if (inv[item.id] > 0) {
				if (inv[item.id] == 1) inventory.push(`${item.prof}`);
				else inventory.push(`${item.prof} (${inv[item.id]})`);
			}
		}
		if (inv.toolbox) inventory.push("🧰 toolbox");

		let badges = [];
		for (const item of badgeEmotes.order) {
			if (userData.badges[item] > 0) badges.push(`${badge_list[badgeEmotes.order.indexOf(item)]}`);
		}
		if (userData.donator == 1) badges.push(badge_list[15]);
		if (userData.donator == 2) badges.push(badge_list[16]);
		if (badges.length == 0) badges.push("There are no badges");

		const embed = new MessageEmbed()
			.setTitle(`${user.username}'s Stats:`)
			.addFields(
				{ name: 'Cents:', value: `${bal}`, inline: false },
				{ name: 'Inventory:', value: `${inventory ? inventory.join('\n') : 'There is nothing here.'}` },
				{ name: 'Job:', value: `${userData.job}`, inline: false },

				{ name: 'Coins Flipped:', value: `${userData.stats.flipped}`, inline: false },
				{ name: 'Minigames Won:', value: `${userData.stats.minigames_won}`, inline: false },
				{ name: 'Badges:', value: `${badges ? badges.join('\n') : 'There are no badges.'}` },
			)
			.setColor('ORANGE');

		interaction.followUp({ embeds: [embed] });

		if (isNaN(bal) || bal == Infinity || bal == undefined) {
			interaction.channel.send({ content: "Hey, it looks like you have a bug in your balance! Please report it in the support server by doing `c!support` so we can make the bot better!" });
		}

	}
};