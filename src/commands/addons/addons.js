const { MessageEmbed } = require('discord.js');
const achievementAdd = require('../../util/achievementAdd');

module.exports = {
	name: 'addons',
	description: 'Get a list of all your addons!',
	usage: '',

	permissions: [],
	ownerOnly: false,
	developerOnly: false,

	error: false,
	execute: async ({ interaction, firestore, userData }) => {

		const paths = [
			userData.addons.customaddons.first,
			userData.addons.customaddons.second,
			userData.addons.customaddons.third,
			userData.online.addonInv.first,
			userData.online.addonInv.second,
			userData.online.addonInv.third,
		];

		const embed = new MessageEmbed()
			.setTitle('Flip Addons:')
			.setColor('GREEN')
			.setFooter({ text: 'If you want to suggest an addon, go to the support server by using /links' })
			.setDescription('You can use these addons by doing the command `/flip <addon>`\nNote that this embed may differ depending on your items and abilities')
			.addFields(
				{ name: 'extra', value: 'Over 100 different responses, such as \'the coin blew up\' or \'the coin was pog\', or \'the coin spent itself on discord nitro\'', inline: true },
				{ name: 'opposite', value: 'The side that it lands on is the opposite! (heads is tails and tails is heads)', inline: true },
			);

		if (userData.inv.bronzecoin > 0) embed.addField('penny', 'Has 10 bronze-related outputs');
		if (userData.inv.silvercoin > 0) embed.addField('dime', 'Has 10 silver and dime related outputs');
		if (userData.inv.goldcoin > 0) embed.addField('dollar', 'Has 10 dollar-related outputs AND gives you 1.5x more cents');
		if (userData.inv.kcoin > 0) embed.addField('24', 'Has 24 mining (some are minecraft) related outputs due to the medal having 24 karat gold AND has a 5% greater chance of getting a briefcase');
		if (userData.karate.abilities.flip == true) embed.addField('train', 'Punches and kicks - train your karate coin and level it up!');

		for (const path of paths) {
			if (path.name.toLowerCase() != 'none') {
				embed.addFields({ name: path.name, value: (path.description ? path.description : 'This addon has no description') });
			}
		}

		interaction.followUp({ embeds: [embed] });

		if (userData.inv.bronzecoin > 0
			&& userData.inv.silvercoin > 0
			&& userData.inv.goldcoin > 0
			&& userData.inv.kcoin > 0
			&& userData.karate.abilities.flip === true) {

			achievementAdd(userData, 'addonMaster').then(async (data) => {
				await firestore.doc(`/users/${interaction.user.id}`).set(data);
			});

		}

	},
};
