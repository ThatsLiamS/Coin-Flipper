/* Import required modules and files */
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { itemlist } = require('./../../../util/constants.js');

module.exports = {
	name: 'shop',
	description: 'View the shop and all the items in it!',
	usage: '`/shop [page] [item]`',

	permissions: [],
	guildOnly: false,

	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('View the shop and all the items in it!')
		.setDMPermission(true)

		.addIntegerOption(option => option.setName('page').setDescription('Which item would you like to take:').setRequired(false))
		.addStringOption(option => option.setName('item').setDescription('Which item would you like to take:').setRequired(false)),

	error: false,

	/**
	 * View the shop and all the items in it.
	 * 
	 * @param {object} interaction - Discord Slash Command object
	 * 
	 * @returns {boolean}
	**/
	execute: async ({ interaction }) => {

		const pageNumber = interaction.options.getInteger('page') || 1;
		const itemName = interaction.options.getString('item')?.toLowerCase();

		/* Shows information on a specifc item */
		if (itemName) {
			/* Find the selected item */
			const item = itemlist.filter((i) => i.name == itemName.toLowerCase() || i.aliases.includes(itemName.toLowerCase()))[0];
			if (!item) {
				interaction.followUp({ content: `\`${itemName}\` is not a valid item.` });
				return false;
			}

			const embed = new EmbedBuilder()
				.setTitle(item.prof.slice(0, 2) + ' ' + item.prof.charAt(3).toUpperCase() + item.prof.slice(4))
				.setColor('Yellow')
				.setDescription(item.description)
				.addFields(
					{ name: '__Cost__', value: `${item.cost ? `${item.cost} cents` : 'This item cannot be bought'}`, inline: false },
					{ name: '__Sell For__', value: `${item.sell ? item.sell : Math.ceil(item.cost / 2)} cents`, inline: false },
					{ name: '__Found In__', value: `${item.found}`, inline: false },
				);

			/* Reply and enable cooldown */
			interaction.followUp({ embeds: [embed] });
			return true;
		}

		/* Create shop pages */
		const embed = [
			new EmbedBuilder()
				.setTitle('Shop - page 1/2')
				.setColor('Yellow')
				.setDescription('use `/buy <item>` to buy an item!')
				.addFields(
					{ name: '🥉 Bronze Coin', value: '`Cost:` 50 cents `Usage:` can use the PENNY add-on\n`Description:` a cool bronze coin', inline: false },
					{ name: '🥈 Silver Coin', value: '`Cost:` 100 cents `Usage:` can use the DIME add-on\n`Description:` a rare silver coin that is worth a lot', inline: false },
					{ name: '🥇 Gold Coin', value: '`Cost:` 200 cents `Usage:` can use the DOLLAR add-on, which has 1.5X more cents\n`Description:` a rare gold coin that is almost impossible to find', inline: false },
					{ name: '🏅 24K Gold Medal', value: '`Cost:` 2000 cents `Usage:` can use the 24 add-on, which has a 5% better chance of getting a briefcase\n`Description:` an ultra rare gold medal made with 100% real gold', inline: false },
					{ name: '📀 Gold Disk', value: '`Cost:` 500 cents `Usage:` gets more cents when flipping\n`Description:` a gold disk that has unlimited musical power', inline: false },
					{ name: '💿 Platinum Disk', value: '`Cost:` 5000 cents `Usage:` gets wayy more cents when flipping\n`Description:` a platinum disk that is even stronger than the gold disk', inline: false },
					{ name: '🏆 Gold Trophy', value: '`Cost:` 500 cents `Usage:` can flex trophy in chat\n`Description:` a gold and shiny trophy that you can flex', inline: false },
					{ name: '🍀 Lucky Clover', value: '`Cost:` 400 cents `Usage:` Have a better chance of winning the lottery\n`Description:` a penny you find lying on the street', inline: false },
					{ name: '🧊 Ice Cube', value: '`Cost:` 25 cents `Usage:` Protects you from paying 50 cents when you leave your job\n`Description:` an ice cube that somehow doesn\'t melt', inline: false },
					{ name: '🔑 Key', value: '`Cost:` 1000 cents `Usage:` ???', inline: false },
				)
				.setFooter({ text: 'Platinum Donators get everything 25% off!\nUse "/shop <page>" to switch to a different page' }),

			new EmbedBuilder()
				.setTitle('Shop - page 2/2')
				.setColor('Yellow')
				.setDescription('use `/buy <item>` to buy an item!')
				.addFields(
					{ name: '📅 Calendar', value: '`Cost:` 5000 cents `Usage:` Can use the monthly command\n`Description:` a normal calendar that helps you keep track of the months', inline: false },
					{ name: '🔐 Vault', value: '`Cost:` 700 cents `Usage:` Can use the daily command twice a day\n`Description:` a secure vault that keeps your money hidden >:)', inline: false },
					{ name: '⛏️ pickaxe', value: '`Cost:` 3000 cents `Usage:` Mine with `c!mine` and get some materials\n`Description:` ~~creeper... aw man~~', inline: false },
					{ name: '⚒️ Hammer', value: '`Cost:` 1000 cents `Usage:` Mine more gems and rocks\n`Description:` A helper item of the pickaxe. Don\'t get this unless you already have the pickaxe', inline: false },
					{ name: '📦 Package', value: '`Cost:` 1000 cents `Usage:` Get more cents when dropshipping\n`Description:` a high-quality top of the line package', inline: false },
					{ name: '🧭 Compass', value: '`Cost:` 1000 cents `Usage:` Has a better chance of getting cents when exploring\n`Description:` a compass that helps you find your way', inline: false },
					{ name: '🎮 Controller', value: '`Cost:` 1000 cents `Usage:` Get 5 times more cents in minigames\n`Description:` a large pro controller that helps you win minigames more', inline: false },
					{ name: '🎱 Broken 8-Ball', value: '`Cost:` 15000 cents `Usage:` It\'s a broken magic 8ball. I honestly don\'t know why its priced so high', inline: false },
					{ name: '📌 Pin', value: '`Cost:` 2000 cents `Usage:` Use it to give another user a special surprise\n`Description:` A sharp pin that looks really painful and distracting', inline: false },
					{ name: '🧨 Dynamite', value: '`Cost:` 1 million cents `Usage:` Blow up the chat\n`Description:` a piece of dynamite that can blow up anything', inline: false },
				)
				.setFooter({ text: 'Platinum Donators get everything 25% off!\nUse "/shop <page>" to switch to a different page' }),
		];

		/* Select the correct page and send */
		interaction.followUp({ embeds: [embed[pageNumber > 2 ? 0 : pageNumber - 1]] });
		
		
		/* return true to enable the cooldown */
		return true;
	},
};
