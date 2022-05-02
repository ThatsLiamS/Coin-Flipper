const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'my-addons',
	description: 'Get a list of all your custom addons!',
	usage: '`/my-addons`',

	permissions: [],
	ownerOnly: false,
	guildOnly: true,
	developerOnly: false,

	error: false,
	execute: async ({ interaction, userData }) => {

		const paths = [
			userData.addons.customaddons.first,
			userData.addons.customaddons.second,
			userData.addons.customaddons.third,
		];

		const embed = new MessageEmbed()
			.setTitle('Custom Addons:')
			.setColor('ORANGE');

		let none = true;
		for (const path of paths) {
			if (path.name.toLowerCase() != 'none') {
				none = false;
				embed.addFields({ name: path.name, value: `Description: ${path.description ? path.description : 'This addon has no description'}\nResponses: ${path.responses ? path.responses.length : '0'}\nPublished: ${path.published ? 'Yes' : 'No'}` });
			}
		}

		if (none == true) embed.setDescription('You have no custom addons, do `/create-addon` to get started.');

		interaction.followUp({ embeds: [embed] });

	},
};
