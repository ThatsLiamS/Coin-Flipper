const Discord = require('discord.js');

const itemlist = require(`${__dirname}/../../tools/constants`).itemlist;
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "shop",
	description: "View the shop and all the items in it!",
	argument: "Optional: the page number OR an item you'd like to inspect further",
	perms: "Embed Links, Manage Messages",
	tips: "If the bot has the Manage Messages permission, it will create a cool reaction-based page system",
	aliases: ["store", "item", "items"],
	execute: async function(message, args) {

		if (!args[0] || !isNaN(args[0])) {
			const embed1 = new Discord.MessageEmbed()
				.setTitle("Shop - Page 1/2")
				.setDescription("Use `c!buy <item>` to buy something!")
				.addField("🥉 Bronze Coin", "`Cost:` 50 cents `Usage:` can use the PENNY add-on\n`Description:` a cool bronze coin")
				.addField("🥈 Silver Coin", "`Cost:` 100 cents `Usage:` can use the DIME add-on\n`Description:` a rare silver coin that is worth a lot")
				.addField("🥇 Gold Coin", "`Cost:` 200 cents `Usage:` can use the DOLLAR add-on, which has 1.5X more cents\n`Description:` a rare gold coin that is almost impossible to find")
				.addField("🏅 24K Gold Medal", "`Cost:` 2000 cents `Usage:` can use the 24 add-on, which has a 5% better chance of getting a briefcase\n`Description:` an ultra rare gold medal made with 100% real gold")
				.addField("📀 Gold Disk", "`Cost:` 500 cents `Usage:` gets more cents when flipping\n`Description:` a gold disk that has unlimited musical power")
				.addField("💿 Platinum Disk", "`Cost:` 5000 cents `Usage:` gets wayy more cents when flipping\n`Description:` a platinum disk that is even stronger than the gold disk")
				.addField("🏆 Gold Trophy", "`Cost:` 500 cents `Usage:` can flex trophy in chat\n`Description:` a gold and shiny trophy that you can flex")
				.addField("🍀 Lucky Clover", "`Cost:` 400 cents `Usage:` Have a better chance of winning the lottery\n`Description:` a penny you find lying on the street")
				.addField("🍪 Cookie", "`Cost:` 500 cents `Usage:` can unlock a world of cookie potential\n`Description:` a scrumptious cookie that looks very appetizing and powerful")
				.addField("🧊 Ice Cube", "`Cost:` 25 cents `Usage:` Protects you from paying 50 cents when you leave your job\n`Description:` an ice cube that somehow doesn't melt")
				.setFooter("Ultra Donators get everything 25% off!\nUse \"c!shop <page>\" to switch to a different page")
				.setColor('YELLOW');

			const embed2 = new Discord.MessageEmbed()
				.setTitle("Shop - Page 2/2")
				.setDescription("Use `c!buy <item>` to buy something!")
				.addField("📅 Calendar", "`Cost:` 5000 cents `Usage:` Can use the monthly command\n`Description:` a normal calendar that helps you keep track of the months")
				.addField("🔐 Vault", "`Cost:` 700 cents `Usage:` Can use the daily command twice a day\n`Description:` a secure vault that keeps your money hidden >:)")
				.addField("🥤 Smoothie", "`Cost:` 500 cents `Usage:` Can drink it and gain a special ability\n`Description:` a delicious smoothie from the stand down the street")
				.addField("⛏️ pickaxe", "`Cost:` 3000 cents `Usage:` Mine with `c!mine` and get some materials\n`Description:` ~~creeper... aw man~~")
				.addField("⚒️ Hammer", "`Cost:` 1000 cents `Usage:` Mine more gems and rocks\n`Description:` A helper item of the pickaxe. Don't get this unless you already have the pickaxe")
				.addField("📦 Package", "`Cost:` 1000 cents `Usage:` Get more cents when dropshipping\n`Description:` a high-quality top of the line package")
				.addField("🧭 Compass", "`Cost:` 1000 cents `Usage:` Has a better chance of getting cents when exploring\n`Description:` a compass that helps you find your way")
				.addField("🎮 Controller", "`Cost:` 1000 cents `Usage:` Get 5 times more cents in minigames\n`Description:` a large pro controller that helps you win minigames more")
				.addField("🎱 Broken 8-Ball", "`Cost:` 15000 cents `Usage:` It's a broken magic 8ball. I honestly don't know why its priced so high")
				.addField("📌 Pin", "`Cost:` 2000 cents `Usage:` Use it to give another user a special surprise\n`Description:` A sharp pin that looks really painful and distracting")
				.addField("🧨 Dynamite", "`Cost:` 1m cents `Usage:` Blow up the chat\n`Description:` a piece of dynamite that can blow up anything")
				.addField("🔑 Key", "`Cost:` 1000 cents `Usage:` ???")
				.setFooter("Ultra Donators get everything 25% off!\nUse \"c!shop <page>\" to switch to a different page")
				.setColor('YELLOW');

			if (args[0] == 2) {
				send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed2] });
			}
			else {
				send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed1] });
			}
		}
		else {
			let itemName = args.slice(0).join(" ");
			let item;
			for (let i of itemlist) {
				if (i.name == itemName) item = i;
				if (i.aliases) {
					if (i.aliases.includes(itemName)) item = i;
				}
			}
			if (!item) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid item!" });
			const embed = new Discord.MessageEmbed()
				.setTitle(item.prof.slice(0, 2) + " " + item.prof.charAt(3).toUpperCase() + item.prof.slice(4))
				.setDescription(item.description);

			if (item.cost !== undefined) embed.addField("Cost", `${item.cost} cents`);
			if (item.sell) embed.addField("Sell For", `${item.sell} cents`);
			else embed.addField("Sell For", `${Math.ceil(item.cost / 2)} cents`);

			embed.addField("Found in:", `${item.found}`);
			embed.setColor("YELLOW");

			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
		}
	}
};