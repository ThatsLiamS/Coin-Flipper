const fs = require("fs");

const commands = {};

const categories = fs.readdirSync(`${__dirname}/../../commands`);
for (let category of categories) {
	if (category != "developers") {
		const commandFiles = fs.readdirSync(`${__dirname}/../../commands/${category}`).filter(file => file.endsWith('.js'));
		for (let file of commandFiles) {
			const command = require(`${__dirname}/../../commands/${category}/${file}`);
			commands[command.name] = command;
		}
		const subCategories = fs.readdirSync(`${__dirname}/../../commands/${category}`).filter(file => !file.endsWith(".js"));
		if (subCategories) {
			for (let subCategory of subCategories) {
				if (!subCategory.startsWith("k_")) {
					const innerCommandFiles = fs.readdirSync(`${__dirname}/../../commands/${category}/${subCategory}`);
					for (let innerFile of innerCommandFiles) {
						const command = require(`${__dirname}/../../commands/${category}/${subCategory}/${innerFile}`);
						commands[command.name] = command;
					}
				}
			}
		}
	}
}

commands.help = {
	name: "help",
	description: "Get a list of all commands, or specify one in particular!",
	argument: "Optional: aa command category (ex. currency or info), or a specific command (ex. flip or bal)",
	perms: "Embed Links",
	tips: "",
	aliases: ["comman ds", "commandlist"]
};

module.exports = {
	name: "help",
	description: "Get a list of all commands, or specify one in particular!",
	argument: "Optional: a command category (ex. currency or info)",
	perms: "Embed Links",
	tips: "",
	aliases: ["commands", "commandlist"],
	execute: async function(firesotre, args, command, msg, discord, data, send) {
		if (!args[0]) {
			let initialEmbed = new discord.MessageEmbed()
				.setTitle("Coin Flipper Commands")
				.setDescription("Use `c!help <category>` to get commands in one category, or `c!help <command>` to get more info on a single command")
				.addFields(
					{ name: "🪙 Coin Flipping", value: "Commands for flipping coins and using fun addons", inline: true },
					{ name: "💸 Currency", value: "A variety of commands for getting and spending cents", inline: true },
					{ name: "🛎️ Info", value: "Invite, support server, privacy policy, and other info", inline: true },
					{ name: "🥋 Karate", value: "Train, level up, and battle your karate coin with a ton of cool commands", inline: true },
					{ name: "📄 Addons", value: "Create your own addons for flipping and publish them to the worldwide addon shop", inline: true },
					{ name: "⚙️ Customization", value: "Commands that let you customize Coin Flipper and its features", inline: true },
					{ name: "🌐 Online", value: "Visit CoinTopia, an online coin-themed world!", inline: true },
					{ name: "💱 Trading", value: "Trade items and cents with other users quickly and efficiently!", inline: true }
				)
				.addField("More to do", `[Invite the bot](https://discord.com/oauth2/authorize?client_id=668850031012610050&scope=bot&permissions=388160)⠀⠀[Support server](https://discord.gg/yD5PDYNXcP)`)
				.setColor("#cd7f32");
			send(initialEmbed);
		}
		else if (args[0] == "flipping" || (args[0] == "coin" && args[1] == "flipping")) {
			let coinFlippingEmbed = new discord.MessageEmbed()
				.setTitle("Coin Flipping Commands")
				.setDescription("`c!flip [addon]` Flip a coin normally, or use an addon to add some spice\n`c!bet <heads | tails> <amt>` Bet an amount of cents on a coin flip\n`c!addons` Get a list of addons you have access to\n`c!flipboard` View the top 10 coin flippers of ALL TIME\n`c!coin [user]` View your profile picture on a coin")
				.setColor("#D3D3D3");
			send(coinFlippingEmbed);
		}
		else if (args[0] == "currency" || args[0] == "cents") {
			let currencyEmbed = new discord.MessageEmbed()
				.setTitle("Currency Commands")
				.addField("General", "`c!bal` Check your balance and inventory\n`c!dropship` Dropship an item and get some cents\n`c!explore` Explore the world!\n`c!minigame` Start a minigame that anyone can participate in\n`c!lottery` Buy a lottery ticket for 20 cents\n`c!claimprize` Claim your prize if you won the lottery\n`c!give <user> <amount>` Give a user an amount of cents\n`c!flipbet <initial amount>` Start a flipbet, where anyone can put cents into the pile!\n`c!leaderboard` View the top 10 users in your server")
				.addField("Items", "`c!shop [item]` See the shop and all the items, or get more information on a particular item\n`c!buy <item>` Buy an item from the shop\n`c!sell <item>` Sell an item to the shop\n`c!use <item>` Use an item from your inventory\n`c!trophy` Flex your trophy on everyone\n`c!dynamite` Flex your hard-earned dynamite and get 100 cents\n`c!status` See what effects you have on\n`c!trash` See whats in your servers trash\n`c!throw <item>` Throw one of your items in the trash\n`c!take <item>` Take one of your items out of the trash\n`c!giveitem <user> <item> [amount]` Give a user an item")
				.addField("Register", "__Note:__ these commands can only be used if you have a register\n`c!register` See whats in your register\n`c!withdraw <amt>` Withdraw an amount of cents from the register (or use all to get them all)\n`c!deposit <amt>` Deposit an amount of cents into the register (or use all to deposit them all)")
				.addField("Working", "`c!jobs` Get a list of all the jobs\n`c!job <job>` Get a job\n`c!work` Work at your job\n`c!quit` Quit your job\n`c!daily` Get your daily cents\n`c!vote` Get cents by voting for the bot\n`c!monthly` Get your monthly cents\n`c!weekly` Get your weekly cents (donators only)")
				.addField("Mining", "__Note:__ these commands can only be used if you have a pickaxe\n`c!mine` Mine in the ground and find minerals\n`c!mining` See your mining data\n`c!upgrade` Upgrade your pickaxe\n`c!rebirth` Start your mining adventure over, but have a permanent booster after")
				.addField("Badges", "`c!badges` Get a list of all the badges and how to obtain them\n`c!claim <badge>` Claim a badge")
				.addField("Limited-Time", "`c!limited` View a new shop with limited-time items\n`c!setbio <bio>` Set your bio\n`c!party` Party all night")
				.setColor("#D3D3D3");
			send(currencyEmbed);
		}
		else if (args[0] == "info" || args[0] == "information") {
			let infoEmbed = new discord.MessageEmbed()
				.setTitle("Info Commands")
				.setDescription("`c!help [category OR command]` Get a full list of commands or specify one of them\n`c!userinfo` Get some info about... yourself!\n`c!achievements [page]` Ge a list of 26 achievements you can get in the bot\n`c!mail` check your mailbox\n\n`c!redeem <code>` Redeem a code that you found to get a reward\n`c!links` Get the links to the support server, website, channel, ToS, Privacy Policy, and more helpful resources\n`c!partners` View one of our partners, Rock Paper Scissors\n`c!botinfo` Get some info about the bot")
				.setColor("#D3D3D3");
			send(infoEmbed);
		}
		else if (args[0] == "karate") {
			let karateEmbed = new discord.MessageEmbed()
				.setTitle("Karate Commands")
				.setDescription("`c!karate tutorial` View the tutorial (this is all you'll need)\n\n`c!karate setup` Set up your karate coin\n`c!karate` View your karate coin and its various stats\n`c!karate rename <name>` Rename your karate coin\n`c!karate forget` Forget your karate coin (reset all its data)\n`c!karate abilities` Get a list of the different abilities you can get\n`c!karate gain <ability>` Gain an ability\n`c!karate shop` Get a list of items you can buy for your karate coin\n`c!karate buy <item>` Buy an item from the karate shop")
				.addField("Battles", "`c!karate battle <user>` Ask a user to battle\n`c!karate choose <ability>` (In DMs) Choose one of your abilities for battle\n`c!karate surrender` Surrender the battle\n`c!karate attack` Attack the opponent with one of your abilities\n`c!karate use <item>` Use an item in battle to regain stats\n`c!karate skip` Skip your turn in a battle")
				.setColor("#D3D3D3");
			send(karateEmbed);
		}
		else if (args[0] == "addons" || args[0] == "customaddons") {
			let addonEmbed = new discord.MessageEmbed()
				.setTitle("Addon Commands")
				.setDescription("`c!addons` Get a list of addons you have access to")
				.addField("Custom Addons", "`c!myaddons` View all your custom addons\n`c!viewaddon <addon name> ['separate']` View one of your addons\n`c!createaddon <addon name>` Create a custom addon\n`c!deleteaddon <addon name>` Delete a custom addon\n`c!cloneaddon <addon name> <name>` Clone a custom addon\n`c!checkaddon <addon name>` Check an addon for any profanities\n`c!renameaddon <addon name> <name>` Rename a custom addon\n`c!setdescription <addon name> <description>` Change the description of a custom addon\n`c!setcost <aaddon name> <cost>` Set the cost of your addon\n\n`c!addresponse <addon name> <response>` Add a response to your custom addon\n`c!addresponses <addon name> <responses>` Add multiple responses to your addon, separated by commas\n`c!deleteresponse <addon name> <response number>` Delete a response from your custom addon\n`c!searchaddon <addon name> <query>` Search your addon responses for something\n`c!addoninputs` See the different inputs you can include in your responses")
				.addField("Online Addons", "`c!addonshop` View the worldwide Addon Shop!\n`c!buyaddon <addon name>` Buy an addon from the Addon Shop\n`c!publishaddon <addon name>` Publish one of your custom addons to the worldwide addon shop")
				.addField("Server Addons", "Only users with the Manage Server permission can use these commands\n`c!addserveraddon <addon name>` Add one of your custom addons as a server addon\n`c!deleteserveraddon <addon name>` Delete one of the server addons")
				.setColor("#D3D3D3");
			send(addonEmbed);
		}
		else if (args[0] == "customization" || args[0] == "custom" || args[0] == "config" || args[0] == "admin") {
			let customizationEmbed = new discord.MessageEmbed()
				.setTitle("Customization Commands")
				.setDescription("`c!serverinfo` Get info about the server\n`c!evil <on or off>` Turn on or off evil mode\n`c!compact <on or off>` Turn on or off compact mode\n`c!plug` Go online\n`c!unplug` Go offline (you can't use any online commands)\n`c!serveraddons` View your server's server addons")
				.addField("Admin Commands", "Only users with the Manage Server permission can use these commands\n`c!setprefix <prefix>` Set a custom prefix for your server\n`c!enable <feature>` Enable a feature\n`c!disable <feature>` Disable a feature\n`c!addserveraddon <addon name>` Add one of your custom addons as a server addon\n`c!deleteserveraddon <addon name>` Delete one of the server addons")
				.addField("Features You Can Enable and Disable", "`flipping` - Coins can be flipped\n`minigames` - Minigames can be started and played\n`publiccreate` - Minigames can be started by anyone\n`trash` - The server has a trash can\n`karate` - Karate coins can be trained and battled\n`customaddons` Custom addons can be created and published\n`online` Online commands can be used\n`trading` Trading commands can be used and sessions can be held")
				.setColor("#D3D3D3");
			send(customizationEmbed);
		}
		else if (args[0] == "global" || args[0] == "cointopia" || args[0] == "online") {
			let onlineEmbed = new discord.MessageEmbed()
				.setTitle("Online Commands")
				.setDescription("Interact with users online!\n\n`c!address [user]` Check your or someone else's address\n`c!sendletter <address> <content>` Send a letter to someone!\n`c!setaddress <address>` Set your address to something\n`c!market` View out the CoinTopia Market")
				.addField("Addons", "`c!addonshop` View the worldwide Addon Shop!\n`c!buyaddon <addon name>` Buy an addon from the Addon Shop\n`c!publishaddon <addon name>` Publish one of your custom addons to the worldwide addon shop")
				.addField("The Tower", "`c!tower` Check out the CoinTopia Tower in all it's glory\n`c!addcoin [coins]` Add a coin to the tower!")
				.setColor("#D3D3D3");
			send(onlineEmbed);
		}
		else if (args[0] == "trading" || args[0] == "exchange") {
			let tradingEmbed = new discord.MessageEmbed()
				.setTitle("Trading Commands")
				.setDescription("Trade with other users easily!\n\n`c!trade <user>` Request to start a trading session with another user\n`c!addtrade <item | 'cents'> [amt]` Add an item or cents to your trades\n`c!removetrade <item | 'cents'> [amt]` Remove an item or cents from your trades\n`c!cancel` Cancel the trading session\n`c!finish` Finish the trading session and accept the trades")
				.setColor("#D3D3D3");
			send(tradingEmbed);
		}
		else {
			let cmdArgs = args.slice(0).join(" ");
			let cmd = commands[cmdArgs];
			for (let property in commands) {
				let aliases = commands[property].aliases;
				if (aliases != undefined) {
					for (let aliase of aliases) {
						if (cmdArgs == aliase) {
							cmdArgs = property;
							cmd = commands[property];
						}
					}
				}
			}
			if (cmd == undefined) return send("That's not a valid command!");
			let title = cmdArgs.charAt(0).toUpperCase() + cmdArgs.slice(1);
			let embed = new discord.MessageEmbed()
				.setTitle(title)
				.addField("Description", cmd.description)
				.addField("Arguments", cmd.argument);
			if (cmd.cooldowny) {
				let cooldown = cmd.cooldowny;
				if (cmd.cooldowny == "1 second") cooldown = "Normal: 1 second\nDonators: 0.75 seconds\nUltra Donators: 0.5 seconds";
				if (cmd.cooldowny == "1.5 seconds") cooldown = "Normal: 1.5 seconds\nDonators: 1.12 seconds\nUltra Donators: 0.75 seconds";
				if (cmd.cooldowny == "10 seconds") cooldown = "Normal: 10 seconds\nDonators: 7.5 seconds\nUltra Donators: 5 seconds";
				embed.addField("Cooldown", cooldown);
			}
			if (cmd.perms) {
				embed.addField("Extra Permissions", cmd.perms);
			}
			if (cmd.aliases) {
				embed.addField("Aliases", cmd.aliases.join(", "));
			}
			if (cmd.tips) {
				embed.addField("Tips", cmd.tips);
			}
			embed.setColor('YELLOW');
			send(embed);
		}
	}
};