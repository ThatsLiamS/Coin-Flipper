/**
 * @author Liam Skinner <me@liamskinner.co.uk>
 * Last Updated: 02/01/2023 (dd/mm/yyyy)
 *
 * Line   18: Minigame Words
 * Line   46: Dropship Items
 * Line  105: Explore Areas
 * Line  203: Emojis
 * Line  210: English Characters
 * Line  214: Achievements
 * Line  373: Items
 * Line  820: Badges
 * Line  955: Jobs
 * Line 1048: Flip Responses
 * Line 1248: Module Exports
**/

const minigameWords = [
	'coin',
	'flip',
	'cents',
	'money',
	'dollar',
	'dollars',
	'cent',
	'price',
	'coin',
	'coins',
	'bank',
	'heads',
	'tails',
	'chip',
	'dime',
	'nickel',
	'penny',
	'quarter',
	'pennies',
	'cost',
	'shop',
	'cash',
	'register',
	'bill',
	'vault',
];

const dropshipItems = [
	'toaster',
	'couch',
	'candy',
	'piggy bank',
	'file cabinet',
	'safe',
	'wrapping paper',
	'pillow',
	'sword',
	'shield',
	'television',
	'computer',
	'remote control',
	'blanket',
	'box',
	'cardboard',
	'trash can',
	'oven',
	'microwave',
	'crystal',
	'water',
	'air',
	'knife',
	'sink',
	'dish',
	'plate',
	'fish',
	'cookie',
	'robe',
	'table',
	'tree',
	'inflatable decoration',
	'light',
	'game console',
	'video game',
	'wallet',
	'cd',
	'robot',
	'gummy',
	'loan',
	'door',
	'wreathe',
	'hat',
	'cap',
	'discord',
	'clothes',
	'wire',
	'plug',
	'controller',
	'pencil',
	'notebook',
	'bed',
	'bookshelf',
	'textbook',
	'pen',
	'pancake',
];

const exploreAreas = [
	{
		name: 'the desert',
		got: 'found {earned} in a cactus!',
		lost: 'a wild animal stole {lost} cents from you!',
	},
	{
		name: 'the forest',
		got: 'found {earned} cents in a tree!',
		lost: 'you got trapped in a branch and had to use {lost} cents to pry yourself out!',
	},
	{
		name: 'the temple',
		got: 'discovered {earned} cents in a treasure chest!',
		lost: 'you trigged a trap and lost {lost} cents getting out of there!',
	},
	{
		name: 'the sky',
		got: 'found {earned} cents in a cloud...?',
		lost: 'a plane crashed into you and knocked {lost} cents out of your pocket!',
	},
	{
		name: 'the moon',
		got: 'found {earned} cents in a crater!',
		lost: 'a moon rover stole {lost} cents from you!',
	},
	{
		name: 'underground tunnels',
		got: 'found {earned} cents in a sewer! (ew)',
		lost: 'you tripped and {lost} cents fell out of your pocket and into the drain!',
	},
	{
		name: 'a village',
		got: 'got gifted {earned} cents from a nice old lady!',
		lost: 'an evil villager stole {lost} cents from you!',
	},
	{
		name: 'the ocean',
		got: 'found a deserted island with {earned} cents ||and a skeleton||',
		lost: 'a shark chomped off your hand and {lost} cents!',
	},
	{
		name: 'the beach',
		got: 'you found {earned} cents randomly on the beach!',
		lost: 'the lifeguard made you give him {lost} cents for tips! (do lifeguards even get tips?)',
	},
	{
		name: 'a store',
		got: 'got {earned} cents in change!',
		lost: 'you actually decided to buy something and lost {lost} cents!',
	},
	{
		name: 'a garden',
		got: 'found {earned} cents hiding in a flower!',
		lost: 'a bee stung you and stole {lost} cents for it\'s queen!',
	},
	{
		name: 'the plains',
		got: 'found {earned} cents... somewhere',
		lost: 'a wild animal stole {lost} cents from you!',
	},
	{
		name: 'a mountain',
		got: 'climbed to the top and found {earned} cents as a reward!',
		lost: 'slipped and fell all the way down, losing {lost} cents along the way!',
	},
	{
		name: 'space',
		got: 'collected {earned} cents from the ISS!',
		lost: 'you went on a spacewalk and {lost} cents drifted out from your pocket!',
	},
	{
		name: 'a volcano',
		got: 'found {earned} cents from a volcanic rock!',
		lost: 'accidentally dropped {lost} cents in the magma!',
	},
	{
		name: 'an amusement park',
		got: 'found {earned} cents at the top of the ferris wheel!',
		lost: 'you wasted {lost} cents trying to win a carnival game!',
	},
	{
		name: 'a house',
		got: '~~stole~~ found {earned} cents in it!',
		lost: 'you were sleeping on a bed that wasn\'t even yours and {lost} cents fell out between the bed and the wall!',
	},
	{
		name: 'a waterfall',
		got: 'you went in the waterfall like in the Legend of Zelda and found {earned} cents in there!',
		lost: 'you fell down the waterfall and when you woke up {lost} cents were gone!',
	},
	{
		name: 'a school',
		got: 'found {earned} cents ~~in a kid\'s locker~~!',
		lost: 'someone found out you weren\'t registered there and you had to pay a {lost} cent fee!',
	},
];

const emojis = {
	'true': '<:true:956523933522362482>',
	'false': '<:false:956523937691500616>',
	'coin_gold_tier': '<:coin_goldtier:832295667795624027>',
	'coin_platinum_tier': '<:coin_platinumtier:832295735445553152>',
};

const normalCharacters = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
];

const achievements = [
	{
		name: 'Builder',
		emoji: '🔨',
		req: 'Create your own addon',
		id: 'builder',
	},
	{
		name: 'To the world!',
		emoji: '🌐',
		req: 'Publish an addon to the Worldwide addon shop',
		id: 'toTheWorld',
	},
	{
		name: 'Addon master',
		emoji: '⭐',
		req: 'Unlock every built-in addon',
		id: 'addonMaster',
	},
	{
		name: 'Badge collection',
		emoji: '<:niceness_badge:832251366432964668>',
		req: 'Unlock every non-exclusive badge',
		id: 'badgeCollection',
	},
	{
		name: 'Cookie wizard',
		emoji: '🍪',
		req: 'Collect at least 500 cookies',
		id: 'cookieWizard',
	},
	{
		name: 'Kaboom!',
		emoji: '💥',
		req: 'Buy and use dynamite',
		id: 'kaboom',
	},
	{
		name: 'Creeper... aw man',
		emoji: '⛏️',
		req: 'Upgrade to a diamond pickaxe',
		id: 'creeperAwMan',
	},
	{
		name: 'Fruit mining',
		emoji: '🍌',
		req: 'Upgrade to a banana pickaxe',
		id: 'fruitMining',
	},
	{
		name: 'Secured',
		emoji: '🔒',
		req: 'Deposit all your cents into the register',
		id: 'secured',
	},
	{
		name: 'Throw it away!',
		emoji: '🗑️',
		req: 'Throw away an item',
		id: 'throwItAway',
	},
	{
		name: 'Nine to five',
		emoji: '⚙️',
		req: 'Work at least 40 times',
		id: 'nineToFive',
	},
	{
		name: 'To the top',
		emoji: '🤖',
		req: 'Vote for the bot and claim your cents',
		id: 'toTheTop',
	},
	{
		name: 'Lucky',
		emoji: '🍀',
		req: 'Earn at least 2000 cents from a lottery ticket',
		id: 'lucky',
	},
	{
		name: 'Generous',
		emoji: '🎉',
		req: 'Give at least 10000 cents to another user',
		id: 'generous',
	},
	{
		name: 'Ungenerous',
		emoji: '💧',
		req: 'Give 1 cent to another user',
		id: 'ungenerous',
	},
	{
		name: 'Don\'t cheat!',
		emoji: '🚫',
		req: 'Copy and paste in a coin flipper typing minigame',
		id: 'dontCheat',
	},
	{
		name: 'What a waste',
		emoji: '🎱',
		req: 'Buy and use a broken 8-ball',
		id: 'whatAWaste',
	},
	{
		name: 'Oh no',
		emoji: '😈',
		req: 'Enable evil mode',
		id: 'ohNo',
	},
	{
		name: 'Just my luck',
		emoji: '😩',
		req: 'Bet all your cents and lose',
		id: 'justMyLuck',
	},
	{
		name: 'Black Belt',
		emoji:  '<:belt_black:975078485737500692>',
		req: 'Train your karate coin to level 16',
		id: 'blackBelt',
	},
	{
		name: 'The master',
		emoji: '🥋',
		req: 'Train your karate coin to level 27',
		id: 'theMaster',
	},
	{
		name: 'True collector',
		emoji: '🎒',
		req: 'Collect at least one of every item in the bot',
		id: 'trueCollector',
	},
	{
		name: 'Pen pals',
		emoji: '📫',
		req: 'Send a letter to another user',
		id: 'penPals',
	},
	{
		name: 'Coin on top',
		emoji: '🪙',
		req: 'Add a coin to the cointopia tower',
		id: 'coinOnTop',
	},
	{
		name: 'Business as usual',
		emoji: '💼',
		req: 'Complete a trading session with another user',
		id: 'businessAsUsual',
	},
	{
		name: 'Ultimate flipper',
		emoji: '<:badge_fliptician:956323335774552084>',
		req: 'Flip at least 1000 coins',
		id: 'ultimateFlipper',
	},
];

const items = [
	{
		name: 'bronze coin',
		aliases: ['bronzecoin', 'bronze'],
		id: 'bronzecoin',
		prof: '🥉 bronze coin',
		emote: '🥉',
		cost: 50,
		description: 'Anyone who has it can use the PENNY addon',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'You can use the PENNY addon when flipping (`c!flip penny`)',
		found: 'shop',
	},
	{
		name: 'silver coin',
		aliases: ['silvercoin', 'silver'],
		id: 'silvercoin',
		prof: '🥈 silver coin',
		emote: '🥈',
		cost: 100,
		description: 'Anyone who has it can use the DIME addon',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'You can use the DIME addon when flipping (`c!flip dime`)',
		found: 'shop',
	},
	{
		name: 'gold coin',
		aliases: ['goldcoin'],
		id: 'goldcoin',
		prof: '🥇 gold coin',
		emote: '🥇',
		cost: 200,
		description: 'Anyone who has it can use the DOLLAR addon, which gives 1.5x more cents',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'You can use the DOLLAR addon when flipping, which gives you 1.5x more cents (`c!flip dollar`)',
		found: 'shop',
	},
	{
		name: '24k gold medal',
		aliases: ['24kgoldmedal', 'goldmedal', 'gold medal', '24k gold', '24kgold', '24k medal', '24kmedal'],
		id: 'kcoin',
		prof: '🏅 24k gold medal',
		emote: '🏅',
		cost: 2000,
		description: 'Anyone who has it can use the 24 addon, which has a 5% greater chance to get a briefcase',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'You can use the 24 addon when flipping, which gives you a 5% greater chance to get a briefcase (`c!flip 24`)',
		found: 'shop',
	},
	{
		name: 'gold disk',
		aliases: ['golddisk', 'disk', 'gold disc', 'golddisc', 'disc'],
		id: 'golddisk',
		prof: '📀 gold disk',
		emote: '📀',
		cost: 500,
		description: 'Gives 2x more cents when flipping',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives 2x more cents when flipping',
		found: 'shop',
	},
	{
		name: 'platinum disk',
		aliases: ['platinum', 'platinumdisk', 'platinum disc', 'platinumdisc'],
		id: 'platinumdisk',
		prof: '💿 platinum disk',
		emote: '💿',
		cost: 5000,
		description: 'Gives 3x more cents when flipping',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives 3x more cents when flipping',
		found: 'shop',
	},
	{
		name: 'calendar',
		aliases: ['calender'],
		id: 'calendar',
		prof: '📅 calendar',
		emote: '📅',
		cost: 5000,
		description: 'Lets you use the `c!monthly` command',
		use: 'Use `c!monthly` to get your monthly cents!',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'gold trophy',
		aliases: ['goldtrophy', 'trophy'],
		id: 'goldtrophy',
		prof: '🏆 gold trophy',
		emote: '🏆',
		cost: 500,
		description: 'Flex your trophy on all your friends',
		use: 'Use `c!trophy` to flex your trophy in chat!',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'lucky clover',
		aliases: ['luckyclover', 'clover', '4-leaf clover', '4leaf clover', '4 leaf clover', '4leafclover', 'lucky penny', 'penny', 'luckypenny'],
		id: 'luckypenny',
		prof: '🍀 lucky clover',
		emote: '🍀',
		cost: 400,
		description: 'Gives you a greater chance to win the lottery',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives you a 60% greater chance to win the lottery',
		found: 'shop',
	},
	{
		name: 'vault',
		aliases: [],
		id: 'vault',
		prof: '🔐 vault',
		emote: '🔐',
		cost: 700,
		description: 'Lets you use the daily command twice\nNote: it only works the day after you buy it',
		use: 'The vault lets you claim your daily reward twice! Use `c!daily` to claim!',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'package',
		aliases: ['box', 'cardboard box', 'cardboardbox', 'cardboard package', 'cardboardpackage'],
		id: 'package',
		prof: '📦 package',
		emote: '📦',
		cost: 1000,
		description: 'Gives you more cents when dropshipping',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives you from 50-500 more cents when dropshipping, depending on the item',
		found: 'shop',
	},
	{
		name: 'compass',
		aliases: [],
		id: 'compass',
		prof: '🧭 compass',
		emote: '🧭',
		cost: 1000,
		description: 'Gives you a greater chance to get cents when exploring',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives you a 33% greater chance to find cents while exploring',
		found: 'shop',
	},
	{
		name: 'broken 8-ball',
		aliases: ['8ball', '8-ball', '8 ball', 'broken 8ball', 'broken 8-ball', 'broken 8 ball', 'broken8ball', 'broken8-ball', 'magic 8-ball', 'magic 8ball', 'magic 8 ball', 'magic8ball', 'magic8-ball'],
		id: 'broken8ball',
		prof: '🎱 broken 8-ball',
		emote: '🎱',
		cost: 15000,
		description: 'Ask a question and get a (somewhat) answer',
		use: 'function1',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'key',
		aliases: [],
		id: 'key',
		prof: '🔑 key',
		emote: '🔑',
		cost: 1000,
		description: 'What does it do... 🤔',
		use: 'It\'s the key to the cash register! Now you can put money in and take money out of it!\nUse `c!register` to see what is in there!',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'controller',
		aliases: ['controller', 'game controller', 'gaming controller', 'gamecontroller', 'gamingcontroller'],
		id: 'controller',
		prof: '🎮 controller',
		emote: '🎮',
		cost: 1000,
		description: 'Gives you more cents when winning minigames',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives you 5x the cents when you win a minigame',
		found: 'shop',
	},
	{
		name: 'dynamite',
		aliases: ['bomb', 'bombs'],
		id: 'dynamite',
		prof: '🧨 dynamite',
		emote: '🧨',
		cost: 1000000,
		description: 'Lets you blow up the chat and get cents (BOOM)',
		use: 'Use `c!dynamite` to blow up the chat!',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'pin',
		aliases: [],
		id: 'pin',
		prof: '📌 pin',
		emote: '📌',
		cost: 1000,
		description: 'Give this to someone else to give them an evil surprise >:)',
		use: 'Use `c!giveitem` to give another user the pin! Make sure to use their tag or ID so they don\'t notice >:)',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'given pin',
		aliases: ['pin given'],
		id: 'pingiven',
		prof: '📌 given pin',
		emote: '📌',
		description: 'Uh oh! Someone gave you this pin! Quick, throw it away!',
		use: 'AAAAAA its a pin! Make sure not to flip a coin or something bad will happen!',
		shop: false,
		status: false,
		sell: 10,
		found: 'given',
	},
	{
		name: 'pickaxe',
		aliases: ['pick'],
		id: 'pickaxe',
		prof: '⛏️ pickaxe',
		emote: '⛏️',
		cost: 3000,
		description: 'Grab your pickaxe and mine, mine, mine!',
		use: 'Use `c!mine` to mine some gems!',
		shop: true,
		status: false,
		found: 'shop',
	},
	{
		name: 'hammer',
		aliases: [],
		id: 'hammer',
		prof: '⚒️ Hammer',
		emote: '⚒️',
		cost: 1000,
		description: 'Mine more stone and gems with a hammer!',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives you a 5% greater chance to get all minerals',
		found: 'shop',
	},
	{
		name: 'ice cube',
		aliases: ['water cube', 'ice', 'iced cube', 'iced', 'water cube', 'cube', 'frozen cube'],
		id: 'icecube',
		prof: '🧊 ice cube',
		emote: '🧊',
		cost: 75,
		description: 'Pour this on your bosses head and stop losing cents when quitting your job!',
		use: 'When you quit your job you won\'t lose any cents!',
		shop: true,
		status: true,
		sdescription: 'When you quit your job you won\'t lose any cents',
		found: 'shop',
	},
	{
		name: 'label',
		aliases: [],
		id: 'label',
		prof: '🏷️ label',
		emote: '🏷️',
		cost: 2000,
		description: 'Increases your register percent by 10',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Increases your register percent by 10%',
		found: 'market',
	},
	{
		name: 'microphone',
		aliases: ['mic'],
		id: 'microphone',
		prof: '🎙️ microphone',
		emote: '🎙️',
		cost: 1000,
		description: 'Lets you change your address\nNote: donators get to change their address without a microphone, and they can change it to anything, not just numbers',
		use: 'Use `c!setaddress` to change your address!',
		shop: true,
		status: false,
		found: 'market',
	},
	{
		name: 'gold card',
		aliases: ['goldcard', 'card', 'gcard', 'credit card', 'creditcard'],
		id: 'goldcard',
		prof: '💳 gold card',
		emote: '💳',
		cost: 500,
		description: 'Lets you add a coin to the CoinTopia Tower',
		use: 'Use `c!addcoin` to add a coin to the tower!',
		shop: true,
		status: false,
		found: 'market',
	},
	{
		name: 'clipboard',
		aliases: ['board'],
		id: 'clipboard',
		prof: '📋 clipboard',
		emote: '📋',
		cost: 250,
		description: 'Gives more cents when working',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives you 1.5x more cents when working at your job',
		found: 'market',
	},
	{
		name: 'party popper',
		aliases: ['party', 'popper', 'streamer'],
		id: 'partypopper',
		prof: '🎉 party popper',
		emote: '🎉',
		cost: 500,
		description: 'Lets you celebrate Coin Flipper 1000 servers!',
		use: 'Use `c!party` to use it and celebrate!',
		shop: true,
		status: false,
		found: 'limited shop',
	},
	{
		name: 'chart',
		aliases: ['barchart', 'bar chart'],
		id: 'chart',
		prof: '📊 chart',
		emote: '📊',
		cost: 50000,
		description: 'Has a better chance to win while betting',
		use: 'status',
		shop: true,
		status: true,
		sdescription: 'Gives you a 5% better chance of winning a bet',
		found: 'limited shop',
	},
	{
		name: 'paper',
		aliases: ['scroll'],
		id: 'paper',
		prof: '🧾 paper',
		emote: '🧾',
		cost: 10000,
		description: 'Add a message to your balance!',
		use: 'Use `c!setbio` to set a message to your bio!`',
		shop: true,
		status: false,
		found: 'limited shop',
	},
	{
		name: 'band-aid',
		aliases: ['bandaid', 'band aid'],
		id: 'bandaid',
		prof: '🩹 band-aid',
		emote: '🩹',
		cost: 100,
		description: 'Restores 10 HP in a karate battle',
		use: 'Use `c!karate use band-aid` in a battle to use it!',
		shop: false,
		status: false,
		found: 'karate shop',
	},
	{
		name: 'soap',
		aliases: [],
		id: 'soap',
		prof: '🧼 soap',
		emote: '🧼',
		cost: 100,
		description: 'Restores 5 ST in a karate battle',
		use: 'Use `c!karate use soap` in a karate battle to use it!',
		shop: false,
		status: false,
		found: 'karate shop',
	},
	{
		name: 'fuel',
		aliases: ['gas'],
		id: 'fuel',
		prof: '⛽ fuel',
		emote: '⛽',
		cost: 200,
		description: 'Restores 10 ST in a karate battle',
		use: 'Use `c!karate use fuel` in a karate battle to use it!',
		shop: false,
		status: false,
		found: 'karate shop',
	},
	{
		name: 'briefcase',
		aliases: ['breifcase', 'brifcase', 'briefcaes'],
		id: 'briefcase',
		prof: '💼 briefcase',
		emote: '💼',
		description: 'Gives you 250-750 cents',
		use: 'function4',
		shop: false,
		status: false,
		sell: 100,
		found: 'flipping coins',
	},
	{
		name: 'master uniform',
		aliases: ['uniform', 'masteruniform', 'karate uniform', 'karateuniform'],
		id: 'masteruniform',
		prof: '🥋 master uniform',
		emote: '🥋',
		description: 'A master uniform that is given to anyone who can get the black belt in karate',
		use: 'This item can\'t be used!',
		shop: false,
		status: false,
		sell: 50000,
		found: 'karate',
	},
];

const badges = [
	{
		id: 'dev',
		name: 'Developer',
		prof: '<:badge_developer:956323651941183488> Developer',
		emoji: '<:badge_developer:956323651941183488>',
		req: 'Be a Coin Flipper Developer!',
	},
	{
		id: 'partnered_dev',
		name: 'Partnered Developer',
		prof: '<:badge_partner:956323653564370966> Partnered Developer',
		emoji: '<:badge_partner:956323653564370966>',
		req: 'Be a partner of Coin Fliper!',
	},
	{
		id: 'support',
		name: 'Supporter',
		prof: '<:badge_support:956323525105446942> Supporter',
		emoji: '<:badge_support:956323525105446942>',
		req: 'Join the support server!',
		condition: 'support',
	},
	{
		id: 'flip',
		name: 'Flipper',
		prof: '<:badge_flipper:956323329688633354> Flipper',
		emoji: '<:badge_flipper:956323329688633354>',
		req: 'Flip 100 coins!',
		condition: 'stats.flips|>|99',
	},
	{
		id: 'flip_plus',
		name: 'Avid Flipper',
		prof: '<:badge_fliptician:956323335774552084> Avid Flipper',
		emoji: '<:badge_fliptician:956323335774552084>',
		req: 'Flip 300 coins!',
		condition: 'stats.flips|>|299',
	},
	{
		id: 'minigame',
		name: 'Gamer',
		prof: '<:badge_minigamer:956323434265182288> Gamer',
		emoji: '<:badge_minigamer:956323434265182288>',
		req: 'Win 25 minigames!',
		condition: 'stats.minigames|>|14',
	},
	{
		id: 'minigame_plus',
		name: 'Pro Gamer',
		prof: '<:badge_pro_gamer:956323436286836826> Pro Gamer',
		emoji: '<:badge_pro_gamer:956323436286836826>',
		req: 'Win 75 minigames!',
		condition: 'stats.minigames|>|74',
	},
	{
		id: 'register',
		name: 'Registered',
		prof: '<:badge_registered:956323523352231946> Registered',
		emoji: '<:badge_registered:956323523352231946>',
		req: 'Buy a key!',
		condition: 'items.key|>|0',
	},
	{
		id: 'collector',
		name: 'Collector',
		prof: '<:badge_collector:956323383103078440> Collector',
		emoji: '<:badge_collector:956323383103078440>',
		req: 'Have 20 items!',
		condition: 'collection|>|19',
	},
	{
		id: 'collector_plus',
		name: 'Scavenger',
		prof: '<:badge_scavenger:956323385762263100> Scavenger',
		emoji: '<:badge_scavenger:956323385762263100>',
		req: 'Have 50 items!',
		condition: 'collection|>|49',
	},
	{
		id: 'rich',
		name: 'Wealthy',
		prof: '<:badge_rich:956323487847440425> Wealthy',
		emoji: '<:badge_rich:956323487847440425>',
		req: 'Have one hundred thousand cents!',
		condition: 'stats.balance|>|99_999',
	},
	{
		id: 'rich_plus',
		name: 'Millionaire',
		prof: '<:badge_wealthy:956323490137505872> Millionaire',
		emoji: '<:badge_wealthy:956323490137505872>',
		req: 'Have one million cents!',
		condition: 'stats.balance|>|999_999',
	},
	{
		id: 'niceness',
		name: 'Niceness',
		prof: '<:badge_niceness:975078534554992720> Niceness',
		emoji: '<:badge_niceness:975078534554992720>',
		req: 'Give 5 users 100k cents!',
		niceness: 'niceness',
	},
	{
		id: 'bughunter',
		name: 'Bug Hunter',
		prof: '<:badge_bug_hunter:956323559544872981> Bug Hunter',
		emoji: '<:badge_bug_hunter:956323559544872981>',
		req: 'Find and report 1 bug!',
		condition: 'stats.bugs|>|0',
	},
	{
		id: 'bughunter_plus',
		name: 'Bug Poacher',
		prof: '<:badge_bug_poacher:956323564766757015> Bug Poacher',
		emoji: '<:badge_bug_poacher:956323564766757015>',
		req: 'Find and report 5 bugs!',
		condition: 'stats.bugs|>|4',
	},
	{
		id: 'gold_tier',
		name: 'Gold Tier',
		prof: '<:badge_cf_gold:956323628817997824> Gold Tier',
		emoji: '<:badge_cf_gold:956323628817997824>',
		req: 'Purchase **Coin Flipper __Gold Tier__**!',
	},
	{
		id: 'platinum_tier',
		name: 'Platinum Tier',
		prof: '<:badge_cf_platinum:956323631397503037> Platinum Tier',
		emoji: '<:badge_cf_platinum:956323631397503037>',
		req: 'Purchase **Coin Flipper __Platinum Tier__**!',
	},
];

const jobs = [
	{
		name: 'Accountant',
		emoji: '🧾',
		req: 'stats.bank|>|99',
		description: 'accountants count money and do math',
		experience: 'must have at least 100 cents in the register',
		working: ['sorting the money', 'flipping pennies', 'doing taxes', 'counting money', 'going to a meeting', 'calculating the profit', 'making a graph', 'searching records', 'giving tax returns', 'predicting trends'],
		level: 1,
		multi: 1,
	},
	{
		name: 'Celebrity',
		emoji: '⛱️',
		req: 'stats.balance|>|9999',
		description: 'celebrities are famous and do famous stuff',
		experience: 'must have at least 10,000 cents',
		working: ['doing absolutely nothing', 'wearing new clothes', 'walking down the runway', 'going viral', 'starring in a movie', 'starting a trend', 'posting on social media', 'flexing your mansion'],
		level: 1,
		multi: 1,
	},
	{
		name: 'Gamer',
		emoji: '🎮',
		req: 'stats.minigames|>|4',
		description: 'gamers play video games and stream',
		experience: 'must have won at least 5 minigames',
		working: ['making a youtube video', 'streaming minecraft', 'getting a sponsor', 'reaching 1000 subscribers so you can get ad revenue', 'playing among us', 'putting 999 ads on your video', 'going viral', 'using a 4k camera'],
		level: 1,
		multi: 1,
	},
	{
		name: 'Engineer',
		emoji: '🛠️',
		req: 'items.hammer|>|0',
		description: 'engineers build and fix things',
		experience: 'must have a hammer',
		working: ['fixing a car', 'building a complex machine', 'making a sale', 'inventing an invention', 'designing a building', 'drawing a blueprint', 'setting up an elevator'],
		level: 2,
		multi: 1.2,
	},
	{
		name: 'Customer Service',
		emoji: '☎️',
		req: 'special1',
		description: 'custom service representatives pick up phone calls and answer questions',
		experience: 'must have sent a letter',
		working: ['answering a phone call', 'answering a question', 'making an FAQ page', 'keeping track of phone calls', 'checking your email', 'checking your phone', 'updating the customer service phone number', 'being nice to rude customers'],
		level: 2,
		multi: 1.2,
	},
	{
		name: 'Teacher',
		emoji: '📚',
		req: 'items.clipboard|>|2',
		description: 'teachers teach kids how to read and write',
		experience: 'must have 3 clipboards (idk why)',
		working: ['reading aloud', 'giving an essay for homework', 'grading homework', 'taking the kids out to recess', 'going over a math problem', 'giving a test', 'giving a pop quiz', 'teaching kids in virtual learning'],
		level: 2,
		multi: 1.2,
	},
	{
		name: 'Doctor',
		emoji: '🏥',
		req: 'items.soap|>|0',
		description: 'doctors help people in need of care',
		experience: 'must have soap in your inventory',
		working: ['helping patients', 'diagnosing a disease', 'wearing a mask', 'staying 6 feet away', 'doing a surgery', 'giving a vaccination', 'prescribing medicine', 'doing hearing and eyesight tests', 'saving lives'],
		level: 3,
		multi: 1.4,
	},
	{
		name: 'Astronaut',
		emoji: '🚀',
		req: 'stats.worked|>|44',
		description: 'astronauts fly into space and visit other worlds',
		experience: 'must have worked at another job 45 times',
		working: ['going to the moon', 'sending supplies', 'flying into space', 'doing a spacewalk', 'fixing a leak', 'training in a simulation', 'going on the vomit comet', 'visiting the ISS'],
		level: 3,
		multi: 1.4,
	},
	{
		name: 'Fighter',
		emoji: '🥊',
		req: 'stats.battles|>|0',
		description: 'fighters fight for a living and do it very well',
		experience: 'must have won at least one battle with a karate coin',
		working: ['punching your opponent', 'kicking your opponent', 'uppercutting your opponent', 'slamming your opponent', 'finishing your opponent', 'knocking your opponent to the ground', 'training for your next battle'],
		level: 3,
		multi: 1.4,
	},
];

const flips = {

	'normal': [
		'The coin landed on heads',
		'The coin landed on tails',
	],

	'24': [
		'The coin landed on heads',
		'The coin landed on tails',
		'The coin went to the mine ||pickaxe swinging from side to side||',
		'The coin mined some diamonds',
		'The coin mined some 24 karat gold',
		'The coin tried to mine but fell in some lava',
		'The coin saw some mobs and immediately said \'nah\' and walked back out',
		'The coin digged straight down :0',
		'The coin got bored of mining',
		'The coin bought the other 3 medals from the shop (`c!shop`)',
		'The coin found a spawner',
		'The coin found some crystal shards',
		'The coin started to flip but saw diamond ore and stopped to mine it',
		'The coin started to mine some gold but then realized it was a gold coin',
		'The coin was so hard that it used itself to mine',
		'The coin crafted itself into a gold pickaxe',
		'The coin downloaded Minecraft 1.17 and found the warden',
		'The coin only got coal',
		'The coin found 23 karat gold and its mad',
		'The coin suffocated in gravel',
		'The coin found an underground village',
		'The coin mixed water and lava together to make obsidian',
		'The coin drowned somehow',
		'The coin kept mining until it found the world barrier',
	],

	'extra': [
		'The coin landed on heads',
		'The coin landed on tails',
		'The coin got a briefcase and started working',
		'The coin got married',
		'The coin watched TV all night',
		'The coin went to Bot Test JS by using `c!support`',
		'The coin played Among Us',
		'The coin became a pro gamer',
		'The coin went to school and stayed back a grade',
		'The coin rolled under the couch',
		'The coin rusted itself',
		'The coin broke apart and rearranged itself into a statue ||of a coin||',
		'The coin coded a coin bot that got more famous than this one',
		'The coin bought Breath Of The Wild',
		'The coin had a battle royale',
		'The coin used an uno reverse card and flipped you',
		'The coin got a pet and killed it',
		'The coin broke down your door',
		'The coin punched you in the face',
		'The coin made a discord account and created a server that got millions of members',
		'The coin created a famous video game',
		'The coin solved world hunger',
		'The coin kept flipping and flipping',
		'The coin unflipped :0',
		'The coin started a real estate business',
		'The coin posted a dank meme',
		'The coin won the olympics',
		'The coin competed in the world series',
		'The coin went to a gym',
		'The coin ran for president ||and won||',
		'The coin spent itself on Discord Nitro',
		'The coin broke your piggy bank and summoned all its friends to attack you',
		'The coin realized that this is all just a bot and broke the fourth wall',
		'The coin ***emphasized*** its fall',
		'The coin sacrificed its life for you',
		'The coin robbed you',
		'The coin tried to drink some water',
		'The coin learned JS and coded a webpage',
		'The coin got a job on Fiverr',
		'The coin watched some YouTube videos',
		'The coin created a social media account and went viral',
		'The coin bought a new gaming headset B)',
		'The coin watched The Mandalorian',
		'The coin watched Ready Player One',
		'The coin watched a bunch of holiday movies',
		'The coin watched the news',
		'The coin bought a PS5',
		'The coin created its own line of gaming hardware and consoles and put Nintendo, Microsoft, and Sony out of business',
		'The coin got bullied by its older brother dollar',
		'The coin stopped and contemplated life\'s meaning',
		'The coin said **yeet**',
		'The coin was pog',
		'The coin found the bots token and changed all the code',
		'The coin flew out the window',
		'The coin typed at 5000wpm',
		'The coin bought some new fancy clothes',
		'The coin drew a comic',
		'The coin played its Xbox One X',
		'The coin built a huge skyscraper in Minecraft',
		'The coin became a handyman',
		'The coin took a vacation from flipping',
		'The coin hung out with the dime and quarter',
		'The coin discovered the lost city of Centlantas',
		'The coin won the lottery',
		'The coin fell asleep and dreamed about flipping',
		'The coin rage quitted Cuphead',
		'The coin became a super hero and saved the world',
		'The coin sang christmas carols',
		'The coin flipped a coin ||wait what||',
		'The coin played Among Us and won as impostor',
		'The coin stayed up on new years',
		'The coin climbed mount everest',
		'The coin sneaked onto a spaceship and became the first coin on mars',
		'The coin learned economics and got terrified that the penny would soon be worthless',
		'The coin got 99 friends and became a dollar',
		'The coin said nah and flipped another time',
		'The coin wrote a novel, sold it, and got a big profit',
		'The coin started its own Coin Wikipedia on Fandom',
		'The coin rented a skyscraper',
		'The coin killed a wasp somehow',
		'The coin won a giveaway in a discord server',
		'The coin flipped 6 feet away (social distancing)',
		'The coin speedran a corn maze and beat the world record',
		'The coin created its own news program',
		'The coin flipped a coin flipped a coin flipped a coin flipped a coin',
		'The coin got its friend Nickel a christmas gift',
		'The coin got stressed from flipping and visited a therapist',
		'The coin flipped itself backwards: sdaeh',
		'The coin made a roblox account but was a noob',
		'The coin was visited by 3 ghosts and learned the true meaning of Christmas',
		'The coin googled how to flip a coin',
		'The coin played rock paper scissors',
		'The coin got food from McDonalds',
		'The coin went to a vacation resort',
		'The coin died and went to heaven',
		'The coin went into the ocean and evaporated - don\'t try this at home',
		'The coin fell into a piggy bank',
		'The coin baked some treats',
		'The coin learned to be a ninja',
		'The coin played Roblox',
		'The coin used this bot somehow',
		'The coin watched The Office',
		'The coin got addicted to Flappy Bird',
		'The coin used itself as a pinball',
		'The coin fell into lava ||and survived even stronger||',
		'The coin defied gravity and landed at an angle',
		'The coin got all the badges in this bot (use `c!badges`)',
		'The coin looked down and realized it had a fear of heights',
		'The coin built a game with Unity',
		'The coin went into Earth\'s atmosphere, and titled the axis up so the seasons would never change',
		'The coin disappeared from reality',
		'The coin streamed on Twitch',
	],

	'opposite': [
		'The coin landed on heads - which means tails',
		'The coin landed on tails - which means heads',
	],

	'penny': [
		'The penny landed on heads',
		'The penny landed on tails',
		'The penny realized it was worthless',
		'The penny shined itself',
		'The penny hibernated and woke up rusty',
		'The penny was sad that it was only 1 cent',
		'The penny wrapped some string around it and became a bronze medal',
		'The penny fell into a piggy bank',
	],

	'dime': [
		'The dime landed on heads',
		'The dime landed on tails',
		'The dime flexed on the penny for being 10x more useful',
		'The dime got 9 friends and became a dollar',
		'The dime realized it was the smallest coin to exist',
		'The dime slid across the floor',
		'The dime learned karate',
		'The dime became the CEO of a huge dime-making company',
		'The dime read memes for the rest of its life',
		'The dime sold some smoothies',
	],

	'dollar': [
		'The dollar landed on heads',
		'The dollar landed on tails',
		'The dollar slowly floated down',
		'The dollar started to flip but then remembered that it wasn\'t a coin and stopped',
		'The dollar flew out the window - you didn\'t care until you remembered that it was an $100 bill',
		'The dollar wondered why you are a flipping a dollar after buying a gold coin',
		'The dollar wooshed into your piggy bank',
		'The dollar smacked you in the face and gave you several paper cuts',
		'The dollar wanted to go back to its family ;-;',
		'The dollar spent itself on a candy',
	],

	'train': [
		'The coin punched',
		'The coin kicked',
		'The coin did a shrunken',
		'The coin attacked so fast that time slowed down for them',
		'The coin won a battle',
	],
};

module.exports = {
	minigameWords,
	dropshipItems,
	exploreAreas,
	emojis,
	normalCharacters,
	achievements,
	itemlist: items,
	badgelist: badges,
	joblist: jobs,
	flips,
};
