module.exports.minigameWords = ["coin", "flip", "cents", "money", "dollar", "dollars", "cent", "price", "coin", "coins", "bank", "heads", "tails", "chip", "dime", "nickel", "penny", "quarter", "pennies", "cost", "shop", "cash", "register", "bill", "vault"];

module.exports.itemlist = [
	{
		name: "bronze coin",
		aliases: ["bronzecoin", "bronze"],
		id: "bronzecoin",
		prof: "🥉 bronze coin",
		emote: "🥉",
		cost: 50,
		description: "Anyone who has it can use the PENNY addon",
		use: "status",
		shop: true,
		status: true,
		sdescription: "You can use the PENNY addon when flipping (`c!flip penny`)",
		found: "shop"
	},
	{
		name: "silver coin",
		aliases: ["silvercoin", "silver"],
		id: "silvercoin",
		prof: "🥈 silver coin",
		emote: "🥈",
		cost: 100,
		description: "Anyone who has it can use the DIME addon",
		use: "status",
		shop: true,
		status: true,
		sdescription: "You can use the DIME addon when flipping (`c!flip dime`)",
		found: "shop"
	},
	{
		name: "gold coin",
		aliases: ["goldcoin"],
		id: "goldcoin",
		prof: "🥇 gold coin",
		emote: "🥇",
		cost: 200,
		description: "Anyone who has it can use the DOLLAR addon, which gives 1.5x more cents",
		use: "status",
		shop: true,
		status: true,
		sdescription: "You can use the DOLLAR addon when flipping, which gives you 1.5x more cents (`c!flip dollar`)",
		found: "shop"
	},
	{
		name: "24k gold medal",
		aliases: ["24kgoldmedal", "goldmedal", "gold medal", "24k gold", "24kgold", "24k medal", "24kmedal"],
		id: "kcoin",
		prof: "🏅 24k gold medal",
		emote: "🏅",
		cost: 2000,
		description: "Anyone who has it can use the 24 addon, which has a 5% greater chance to get a briefcase",
		use: "status",
		shop: true,
		status: true,
		sdescription: "You can use the 24 addon when flipping, which gives you a 5% greater chance to get a briefcase (`c!flip 24`)",
		found: "shop"
	},
	{
		name: "gold disk",
		aliases: ["golddisk", "disk", "gold disc", "golddisc", "disc"],
		id: "golddisk",
		prof: "📀 gold disk",
		emote: "📀",
		cost: 500,
		description: "Gives 2x more cents when flipping",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives 2x more cents when flipping",
		found: "shop"
	},
	{
		name: "platinum disk",
		aliases: ["platinum", "platinumdisk", "platinum disc", "platinumdisc"],
		id: "platinumdisk",
		prof: "💿 platinum disk",
		emote: "💿",
		cost: 5000,
		description: "Gives 3x more cents when flipping",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives 3x more cents when flipping",
		found: "shop"
	},
	{
		name: "calendar",
		aliases: ["calender"],
		id: "calendar",
		prof: "📅 calendar",
		emote: "📅",
		cost: 5000,
		description: "Lets you use the `c!monthly` command",
		use: "Use `c!monthly` to get your monthly cents!",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "gold trophy",
		aliases: ["goldtrophy", "trophy"],
		id: "goldtrophy",
		prof: "🏆 gold trophy",
		emote: "🏆",
		cost: 500,
		description: "Flex your trophy on all your friends",
		use: "Use `c!trophy` to flex your trophy in chat!",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "lucky clover",
		aliases: ["luckyclover", "clover", "4-leaf clover", "4leaf clover", "4 leaf clover", "4leafclover", "lucky penny", "penny", "luckypenny"],
		id: "luckypenny",
		prof: "🍀 lucky clover",
		emote: "🍀",
		cost: 400,
		description: "Gives you a greater chance to win the lottery",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives you a 60% greater chance to win the lottery",
		found: "shop"
	},
	{
		name: "vault",
		aliases: [],
		id: "vault",
		prof: "🔐 vault",
		emote: "🔐",
		cost: 700,
		description: "Lets you use the daily command twice\nNote: it only works the day after you buy it",
		use: "The vault lets you claim your daily reward twice! Use `c!daily` to claim!",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "package",
		aliases: ["box", "cardboard box", "cardboardbox", "cardboard package", "cardboardpackage"],
		id: "package",
		prof: "📦 package",
		emote: "📦",
		cost: 1000,
		description: "Gives you more cents when dropshipping",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives you from 50-500 more cents when dropshipping, depending on the item",
		found: "shop"
	},
	{
		name: "compass",
		aliases: [],
		id: "compass",
		prof: "🧭 compass",
		emote: "🧭",
		cost: 1000,
		description: "Gives you a greater chance to get cents when exploring",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives you a 33% greater chance to find cents while exploring",
		found: "shop"
	},
	{
		name: "broken 8-ball",
		aliases: ["8ball", "8-ball", "8 ball", "broken 8ball", "broken 8-ball", "broken 8 ball", "broken8ball", "broken8-ball", "magic 8-ball", "magic 8ball", "magic 8 ball", "magic8ball", "magic8-ball"],
		id: "broken8ball",
		prof: "🎱 broken 8-ball",
		emote: "🎱",
		cost: 15000,
		description: "Ask a question and get a (somewhat) answer",
		use: "function1",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "key",
		aliases: [],
		id: "key",
		prof: "🔑 key",
		emote: "🔑",
		cost: 1000,
		description: "What does it do... 🤔",
		use: "It's the key to the cash register! Now you can put money in and take money out of it!\nUse `c!register` to see what is in there!",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "smoothie",
		aliases: ["drink"],
		id: "smoothie",
		prof: "🥤 smoothie",
		emote: "🥤",
		cost: 500,
		description: "Gives you a flip multiplier for 10 minutes after you use it",
		use: "function2",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "cookie",
		aliases: [],
		id: "cookie",
		prof: "🍪 cookie",
		emote: "🍪",
		cost: 500,
		description: "Lets you access the cookie world",
		use: "function3",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "controller",
		aliases: ["controller", "game controller", "gaming controller", "gamecontroller", "gamingcontroller"],
		id: "controller",
		prof: "🎮 controller",
		emote: "🎮",
		cost: 1000,
		description: "Gives you more cents when winning minigames",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives you 5x the cents when you win a minigame",
		found: "shop"
	},
	{
		name: "dynamite",
		aliases: ["bomb", "bombs"],
		id: "dynamite",
		prof: "🧨 dynamite",
		emote: "🧨",
		cost: 1000000,
		description: "Lets you blow up the chat and get cents (BOOM)",
		use: "Use `c!dynamite` to blow up the chat!",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "pin",
		aliases: [],
		id: "pin",
		prof: "📌 pin",
		emote: "📌",
		cost: 1000,
		description: "Give this to someone else to give them an evil surprise >:)",
		use: "Use `c!giveitem` to give another user the pin! Make sure to use their tag or ID so they don't notice >:)",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "given pin",
		aliases: ["pin given"],
		id: "pingiven",
		prof: "📌 given pin",
		emote: "📌",
		description: "Uh oh! Someone gave you this pin! Quick, throw it away!",
		use: "AAAAAA its a pin! Make sure not to flip a coin or something bad will happen!",
		shop: false,
		status: false,
		sell: 10,
		found: "given"
	},
	{
		name: "pickaxe",
		aliases: ["pick"],
		id: "pickaxe",
		prof: "⛏️ pickaxe",
		emote: "⛏️",
		cost: 3000,
		description: "Grab your pickaxe and mine, mine, mine!",
		use: "Use `c!mine` to mine some gems!",
		shop: true,
		status: false,
		found: "shop"
	},
	{
		name: "hammer",
		aliases: [],
		id: "hammer",
		prof: "⚒️ Hammer",
		emote: "⚒️",
		cost: 1000,
		description: "Mine more stone and gems with a hammer!",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives you a 5% greater chance to get all minerals",
		found: "shop"
	},
	{
		name: "ice cube",
		aliases: ["water cube", "ice", "iced cube", "iced", "water cube", "cube", "frozen cube"],
		id: "icecube",
		prof: "🧊 ice cube",
		emote: "🧊",
		cost: 25,
		description: "Pour this on your bosses head and stop losing cents when quitting your job!",
		use: "When you quit your job you won't lose any cents!",
		shop: true,
		status: true,
		sdescription: "When you quit your job you won't lose any cents",
		found: "shop"
	},
	{
		name: "label",
		aliases: [],
		id: "label",
		prof: "🏷️ label",
		emote: "🏷️",
		cost: 2000,
		description: "Increases your register percent by 10",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Increases your register percent by 10%",
		found: "market"
	},
	{
		name: "microphone",
		aliases: ["mic"],
		id: "microphone",
		prof: "🎙️ microphone",
		emote: "🎙️",
		cost: 1000,
		description: "Lets you change your address\nNote: donators get to change their address without a microphone, and they can change it to anything, not just numbers",
		use: "Use `c!setaddress` to change your address!",
		shop: true,
		status: false,
		found: "market"
	},
	{
		name: "gold card",
		aliases: ["goldcard", "card", "gcard", "credit card", "creditcard"],
		id: "goldcard",
		prof: "💳 gold card",
		emote: "💳",
		cost: 500,
		description: "Lets you add a coin to the CoinTopia Tower",
		use: "Use `c!addcoin` to add a coin to the tower!",
		shop: true,
		status: false,
		found: "market"
	},
	{
		name: "clipboard",
		aliases: ["board"],
		id: "clipboard",
		prof: "📋 clipboard",
		emote: "📋",
		cost: 250,
		description: "Gives more cents when working",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives you 1.5x more cents when working at your job",
		found: "market"
	},
	{
		name: "party popper",
		aliases: ["party", "popper", "streamer"],
		id: "partypopper",
		prof: "🎉 party popper",
		emote: "🎉",
		cost: 500,
		description: "Lets you celebrate Coin Flipper 1000 servers!",
		use: "Use `c!party` to use it and celebrate!",
		shop: true,
		status: false,
		found: "limited shop"
	},
	{
		name: "chart",
		aliases: ["barchart", "bar chart"],
		id: "chart",
		prof: "📊 chart",
		emote: "📊",
		cost: 50000,
		description: "Has a better chance to win while betting",
		use: "status",
		shop: true,
		status: true,
		sdescription: "Gives you a 5% better chance of winning a bet",
		found: "limited shop"
	},
	{
		name: "gift",
		aliases: ["present50000", "gift50000", "giftbox50000"],
		id: "gift50000",
		prof: "🎁 gift",
		emote: "🎁",
		cost: 50000,
		description: "Give a gift to your friend! (and a small chance of an item too)",
		use: "function6",
		shop: true,
		status: false,
		found: "limited shop"
	},
	{
		name: "gift",
		aliases: ["present10000", "gift10000", "giftbox10000"],
		id: "gift10000",
		prof: "🎁 gift",
		emote: "🎁",
		cost: 10000,
		description: "Give a gift to your friend! (and a small chance of an item too)",
		use: "function6",
		shop: true,
		status: false,
		found: "limited shop"
	},
	{
		name: "gift",
		aliases: ["present5000", "gift5000", "giftbox5000"],
		id: "gift5000",
		prof: "🎁 gift",
		emote: "🎁",
		cost: 5000,
		description: "Give a gift to your friend for 5000 cents! (and a small chance of an item too)",
		use: "function6",
		shop: true,
		status: false,
		found: "limited shop"
	},
	{
		name: "gift",
		aliases: ["present100000", "gift100000", "giftbox100000"],
		id: "gift100000",
		prof: "🎁 gift",
		emote: "🎁",
		cost: 100000,
		description: "Give a gift to your friend for 100000 cents! (and a small chance of an item too)",
		use: "function6",
		shop: true,
		status: false,
		found: "limited shop"
	},
	{
		name: "gift",
		aliases: ["present500000", "gift500000", "giftbox500000"],
		id: "gift500000",
		prof: "🎁 gift",
		emote: "🎁",
		cost: 500000,
		description: "Give a gift to your friend for 500000 cents! (and a small chance of an item too)",
		use: "function6",
		shop: true,
		status: false,
		found: "limited shop"
	},
	{
		name: "paper",
		aliases: ["scroll"],
		id: "paper",
		prof: "🧾 paper",
		emote: "🧾",
		cost: 10000,
		description: "Add a message to your balance!",
		use: "Use `c!setbio` to set a message to your bio!`",
		shop: true,
		status: false,
		found: "limited shop"
	},
	{
		name: "band-aid",
		aliases: ["bandaid", "band aid"],
		id: "bandaid",
		prof: "🩹 band-aid",
		emote: "🩹",
		cost: 100,
		description: "Restores 10 HP in a karate battle",
		use: "Use `c!karate use band-aid` in a battle to use it!",
		shop: false,
		status: false,
		found: "karate shop"
	},
	{
		name: "soap",
		aliases: [],
		id: "soap",
		prof: "🧼 soap",
		emote: "🧼",
		cost: 100,
		description: "Restores 5 ST in a karate battle",
		use: "Use `c!karate use soap` in a karate battle to use it!",
		shop: false,
		status: false,
		found: "karate shop"
	},
	{
		name: "fuel",
		aliases: ["gas"],
		id: "fuel",
		prof: "⛽ fuel",
		emote: "⛽",
		cost: 200,
		description: "Restores 10 ST in a karate battle",
		use: "Use `c!karate use fuel` in a karate battle to use it!",
		shop: false,
		status: false,
		found: "karate shop"
	},
	{
		name: "briefcase",
		aliases: ["breifcase", "brifcase", "briefcaes"],
		id: "briefcase",
		prof: "💼 briefcase",
		emote: "💼",
		description: "Gives you 250-750 cents",
		use: "function4",
		shop: false,
		status: false,
		sell: 100,
		found: "flipping coins"
	},
	{
		name: "master uniform",
		aliases: ["uniform", "masteruniform", "karate uniform", "karateuniform"],
		id: "masteruniform",
		prof: "🥋 master uniform",
		emote: "🥋",
		description: "A master uniform that is given to anyone who can get the black belt in karate",
		use: "This item can't be used!",
		shop: false,
		status: false,
		sell: 50000,
		found: "karate"
	}
];

module.exports.dropshipItems = [
	"toaster",
	"couch",
	"candy",
	"piggy bank",
	"file cabinet",
	"safe",
	"wrapping paper",
	"pillow",
	"sword",
	"shield",
	"television",
	"computer",
	"remote control",
	"blanket",
	"box",
	"cardboard",
	"trash can",
	"oven",
	"microwave",
	"crystal",
	"water",
	"air",
	"knife",
	"sink",
	"dish",
	"plate",
	"fish",
	"cookie",
	"robe",
	"table",
	"tree",
	"inflatable decoration",
	"light",
	"game console",
	"video game",
	"wallet",
	"cd",
	"robot",
	"gummy",
	"loan",
	"door",
	"wreathe",
	"hat",
	"cap",
	"discord",
	"clothes",
	"wire",
	"plug",
	"controller",
	"pencil",
	"notebook",
	"bed",
	"bookshelf",
	"textbook",
	"pen",
	"pancake"
];

module.exports.exploreAreas = [
	"desert",
	"forest",
	"dunes",
	"temple",
	"sky",
	"moon",
	"tunnels",
	"village",
	"ocean",
	"beach",
	"store",
	"garden",
	"plains",
	"mountains",
	"space",
	"volcano",
	"amusement park",
	"house",
	"waterfall"
];

module.exports.exploreAreas = [
	{
		name: "the desert",
		got: "found {earned} in a cactus!",
		lost: "a wild animal stole {lost} cents from you!"
	},
	{
		name: "the forest",
		got: "found {earned} cents in a tree!",
		lost: "you got trapped in a branch and had to use {lost} cents to pry youself out!"
	},
	{
		name: "the temple",
		got: "discovered {earned} cents in a treasure chest!",
		lost: "you trigged a trap and lost {lost} cents getting out of there!"
	},
	{
		name: "the sky",
		got: "found {earned} cents in a cloud...?",
		lost: "a plane crashed into you and knocked {lost} cents out of your pocket!"
	},
	{
		name: "the moon",
		got: "found {earned} cents in a crater!",
		lost: "a moon rover stole {lost} cents from you!"
	},
	{
		name: "underground tunnels",
		got: "found {earned} cents in a sewer! (ew)",
		lost: "you tripped and {lost} cents fell out of your pocket and into the drain!"
	},
	{
		name: "a village",
		got: "got gifted {earned} cents from a nice old lady!",
		lost: "an evil villager stole {lost} cents from you!"
	},
	{
		name: "the ocean",
		got: "found a deserted island with {earned} cents ||and a skeleton||",
		lost: "a shark chomped off your hand and {lost} cents!"
	},
	{
		name: "the beach",
		got: "you found {earned} cents randomly on the beach!",
		lost: "the lifeguard made you give him {lost} cents for tips! (do lifeguards even get tips?)"
	},
	{
		name: "a store",
		got: "got {earned} cents in change!",
		lost: "you actually decided to buy something and lost {lost} cents!"
	},
	{
		name: "a garden",
		got: "found {earned} cents hiding in a flower!",
		lost: "a bee stung you and stole {lost} cents for it's queen!"
	},
	{
		name: "the plains",
		got: "found {earned} cents... somewhere",
		lost: "a wild animal stole {lost} cents from you!"
	},
	{
		name: "a mountain",
		got: "climbed to the top and found {earned} cents as a reward!",
		lost: "slipped and fell all the way down, losing {lost} cents along the way!"
	},
	{
		name: "space",
		got: "collected {earned} cents from the ISS!",
		lost: "you went on a spacewalk and {lost} cents drifted out from your pocket!"
	},
	{
		name: "a volcano",
		got: "found {earned} cents from a volcanic rock!",
		lost: "accidentally dropped {lost} cents in the magma!"
	},
	{
		name: "an amusement park",
		got: "found {earned} cents at the top of the ferris wheel!",
		lost: "you wasted {lost} cents trying to win a carnival game!"
	},
	{
		name: "a house",
		got: "~~stole~~ found {earned} cents in it!",
		lost: "you were sleeping on a bed that wasn't even yours and {lost} cents fell out between the bed and the wall!"
	},
	{
		name: "a waterfall",
		got: "you went in the waterfall like in the Legend of Zelda and found {earned} cents in there!",
		lost: "you fell down the waterfall and when you woke up {lost} cents were gone!"
	},
	{
		name: "a school",
		got: "found {earned} cents ~~in a kid's locker~~!",
		lost: "someone found out you weren't registered there and you had to pay a {lost} cent fee!"
	}
];

module.exports.normalCharacters = [
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
];

module.exports.achievements = [
	{
		name: "Builder",
		emoji: "🔨",
		req: "Create your own addon",
		id: "builder"
	},
	{
		name: "To the world!",
		emoji: "🌐",
		req: "Publish an addon to the Worldwide addon shop",
		id: "toTheWorld"
	},
	{
		name: "Addon master",
		emoji: "⭐",
		req: "Unlock every built-in addon",
		id: "addonMaster"
	},
	{
		name: "Badge collection",
		emoji: "<:niceness_badge:832251366432964668>",
		req: "Unlock every non-exclusive badge",
		id: "badgeCollection"
	},
	{
		name: "Cookie wizard",
		emoji: "🍪",
		req: "Collect at least 500 cookies",
		id: "cookieWizard"
	},
	{
		name: "Kaboom!",
		emoji: "💥",
		req: "Buy and use dynamite",
		id: "kaboom"
	},
	{
		name: "Creeper... aw man",
		emoji: "⛏️",
		req: "Upgrade to a diamond pickaxe",
		id: "creeperAwMan"
	},
	{
		name: "Fruit mining",
		emoji: "🍌",
		req: "Upgrade to a banana pickaxe",
		id: "fruitMining"
	},
	{
		name: "Secured",
		emoji: "🔒",
		req: "Deposit all your cents into the register",
		id: "secured"
	},
	{
		name: "Throw it away!",
		emoji: "🗑️",
		req: "Throw away an item",
		id: "throwItAway"
	},
	{
		name: "Nine to five",
		emoji: "⚙️",
		req: "Work at least 40 times",
		id: "nineToFive"
	},
	{
		name: "To the top",
		emoji: "🤖",
		req: "Vote for the bot and claim your cents",
		id: "toTheTop"
	},
	{
		name: "Lucky",
		emoji: "🍀",
		req: "Earn at least 2000 cents from a lottery ticket",
		id: "lucky"
	},
	{
		name: "Generous",
		emoji: "🎉",
		req: "Give at least 10000 cents to another user",
		id: "generous"
	},
	{
		name: "Ungenerous",
		emoji: "💧",
		req: "Give 1 cent to another user",
		id: "ungenerous"
	},
	{
		name: "Don't cheat!",
		emoji: "🚫",
		req: "Copy and paste in a coin flipper typing minigame",
		id: "dontCheat"
	},
	{
		name: "What a waste",
		emoji: "🎱",
		req: "Buy and use a broken 8-ball",
		id: "whatAWaste"
	},
	{
		name: "Oh no",
		emoji: "😈",
		req: "Enable evil mode",
		id: "ohNo"
	},
	{
		name: "Just my luck",
		emoji: "😩",
		req: "Bet all your cents and lose",
		id: "justMyLuck"
	},
	{
		name: "Black Belt",
		emoji: "<:blackbelt:842511815173996634>",
		req: "Train your karate coin to level 16",
		id: "blackBelt"
	},
	{
		name: "The master",
		emoji: "🥋",
		req: "Train your karate coin to level 27",
		id: "theMaster"
	},
	{
		name: "True collector",
		emoji: "🎒",
		req: "Collect at least one of every item in the bot",
		id: "trueCollector"
	},
	{
		name: "Pen pals",
		emoji: "📫",
		req: "Send a letter to another user",
		id: "penPals"
	},
	{
		name: "Coin on top",
		emoji: "🪙",
		req: "Add a coin to the cointopia tower",
		id: "coinOnTop"
	},
	{
		name: "Business as usual",
		emoji: "💼",
		req: "Complete a trading session with another user",
		id: "businessAsUsual"
	},
	{
		name: "Ultimate flipper",
		emoji: "<:avidflipper_badge:832251366369787914>",
		req: "Flip at least 1000 coins",
		id: "ultimateFlipper"
	}
];

module.exports.joblist = [
	{
		name: "Accountant",
		emoji: "🧾",
		req: "currencies.register|>|99",
		description: "accountants count money and do math",
		experience: "must have at least 100 cents in the register",
		working: ["sorting the money", "flipping pennies", "doing taxes", "counting money", "going to a meeting", "calculating the profit", "making a graph", "searching records", "giving tax returns", "predicting trends"],
		level: 1,
		multi: 1
	},
	{
		name: "Celebrity",
		emoji: "⛱️",
		req: "currencies.cents|>|9999",
		description: "celebrities are famous and do famous stuff",
		experience: "must have at least 10,000 cents",
		working: ["doing absolutely nothing", "wearing new clothes", "walking down the runway", "going viral", "starring in a movie", "starting a trend", "posting on social media", "flexing your mansion"],
		level: 1,
		multi: 1
	},
	{
		name: "Gamer",
		emoji: "🎮",
		req: "stats.minigames_won|>|4",
		description: "gamers play video games and stream",
		experience: "must have won at least 5 minigames",
		working: ["making a youtube video", "streaming minecraft", "getting a sponsor", "reaching 1000 subscribers so you can get ad revenue", "playing among us", "putting 999 ads on your video", "going viral", "using a 4k camera"],
		level: 1,
		multi: 1
	},
	{
		name: "Engineer",
		emoji: "🛠️",
		req: "inv.hammer|>|0",
		description: "engineers build and fix things",
		experience: "must have a hammer",
		working: ["fixing a car", "building a complex machine", "making a sale", "inventing an invention", "designing a building", "drawing a blueprint", "setting up an elevator"],
		level: 2,
		multi: 1.2
	},
	{
		name: "Customer Service",
		emoji: "☎️",
		req: "special1",
		description: "custom service representatives pick up phone calls and answer questions",
		experience: "must have sent a letter",
		working: ["answering a phone call", "answering a question", "making an FAQ page", "keeping track of phone calls", "checking your email", "checking your phone", "updating the customer service phone number", "being nice to rude customers"],
		level: 2,
		multi: 1.2
	},
	{
		name: "Teacher",
		emoji: "📚",
		req: "inv.clipboard|>|2",
		description: "teachers teach kids how to read and write",
		experience: "must have 3 clipboards (idk why)",
		working: ["reading aloud", "giving an essay for homework", "grading homework", "taking the kids out to recess", "going over a math problem", "giving a test", "giving a pop quiz", "teaching kids in virtual learning"],
		level: 2,
		multi: 1.2
	},
	{
		name: "Doctor",
		emoji: "🏥",
		req: "inv.soap|>|0",
		description: "doctors help people in need of care",
		experience: "must have soap in your inventory",
		working: ["helping patients", "diagnosing a disease", "wearing a mask", "staying 6 feet away", "doing a surgery", "giving a vaccination", "prescribing medicine", "doing hearing and eyesight tests", "saving lives"],
		level: 3,
		multi: 1.4
	},
	{
		name: "Astronaut",
		emoji: "🚀",
		req: "stats.timesWorked|>|44",
		description: "astronauts fly into space and visit other worlds",
		experience: "must have worked at another job 45 times",
		working: ["going to the moon", "sending supplies", "flying into space", "doing a spacewalk", "fixing a leak", "training in a simulation", "going on the vomit comet", "visiting the ISS"],
		level: 3,
		multi: 1.4
	},
	{
		name: "Fighter",
		emoji: "🥊",
		req: "stats.timesWon|>|0",
		description: "fighters fight for a living and do it very well",
		experience: "must have won at least one battle with a karate coin",
		working: ["punching your opponent", "kicking your opponent", "uppercutting your opponent", "slamming your opponent", "finishing your opponent", "knocking your opponent to the ground", "training for your next battle"],
		level: 3,
		multi: 1.4
	}
];