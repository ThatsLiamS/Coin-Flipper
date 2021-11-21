const Discord = require('discord.js');

const check = require(`${__dirname}/../../tools/check`);
const itemlist = require(`${__dirname}/../../tools/constants`).itemlist;
const badgeEmotes = require(`${__dirname}/../../tools/badgeEmotes`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "bal",
	description: "Check your balance or someone else's balance",
	argument: "Optional: a user mention or user ID",
	perms: "Embed Links, Use External Emojis",
	tips: "",
	aliases: ["cents", "balance", 'inv', 'inventory'],
	execute: async function(message, args, prefix, client, [firebase]) {

		let bIdList = ["dev", "partnered_dev", "support", "flip", "flip_plus", "minigame", "minigame_plus", "register", "collector", "collector_plus", "rich", "rich_plus", "niceness", "bughunter", "bughunter_plus"];
		let badgeList = [`${badgeEmotes.developer} Developer`, `${badgeEmotes.partnered_dev} Partnered Dev`, `${badgeEmotes.supporter} Supporter`, `${badgeEmotes.flipper} Flipper`, `${badgeEmotes.avid_flipper} Avid Flipper`, `${badgeEmotes.gamer} Gamer`, `${badgeEmotes.pro_gamer} Pro Gamer`, `${badgeEmotes.registered} Registered`, `${badgeEmotes.collector} Collector`, `${badgeEmotes.scavenger} Scavenger`, `${badgeEmotes.wealthy} Wealthy`, `${badgeEmotes.millionaire} Millionaire`, `${badgeEmotes.niceness} Niceness`, `${badgeEmotes.bug_hunter} Bug Hunter`, `${badgeEmotes.bug_poacher} Bug Poacher`];

		let user = message.mentions.users.first();
		if (!user) {
			if (args[0]) {
				if (!isNaN(args[0])) {
					user = client.users.cache.get(args[0]);
					if (!user) user = message.author;
				}
				else{
					user = message.author;
				}
			}
			else{
				user = message.author;
			}
		}

		if (user.id != message.author.id) await check(firebase, user.id);
		let userdata = await firebase.doc(`/users/${user.id}`).get();

		let userData = userdata.data();
		let bio = userData.stats.bio;
		if (user.bot) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Bots don't have ~~sense~~ cents" });

		if (userData.compact === true) {
			let bal = userData.currencies.cents;
			let string = `Cents: \`${bal}\``;
			if (userData.inv.key > 0) string = string + `\nRegister: \`${userData.currencies.register}\``;

			const embed = new Discord.MessageEmbed()
				.setTitle(`${user.username}'s Balance:`)
				.setDescription(string)
				.setColor("ORANGE");

			let description = embed.description;
			if (bio) embed.setDescription(`${bio}\n${description}`);
			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

			if (isNaN(bal) || bal == Infinity || bal == undefined) send.sendChannel({ channel: message.channel, author: message.author }, { content: "Hey, it looks like you have a bug in your balance! Please report it in the support server by doing `c!support` so we can make the bot better!" });
		}
		else {
			let bal = userData.currencies.cents;
			let inv = userData.inv;
			let organized = [];
			for (let item of itemlist) {
				if (inv[item.id] > 0) {
					if (inv[item.id] == 1) organized.push(`${item.prof}`);
					else organized.push(`${item.prof} (${inv[item.id]})`);
				}
			}
			if (inv.toolbox) organized.push("🧰 toolbox");
			if (organized.length == 0) organized.push("There's nothing here");

			let job = userData.job;
			let wins = userData.stats.minigames_won;
			let flips = userData.stats.flipped;
			let badges = userData.badges;
			let badgesOrganized = [];
			for (let item of bIdList) {
				if (badges[item] > 0) badgesOrganized.push(`${badgeList[bIdList.indexOf(item)]}`);
			}
			if (userData.donator == 1) badgesOrganized.push(`${badgeEmotes.gold_tier} Gold Tier`);
			if (userData.donator == 2) badgesOrganized.push(`${badgeEmotes.platinum_tier} Platinum Tier`);
			if (badgesOrganized.length == 0) badgesOrganized.push("There are no badges");

			const embed = new Discord.MessageEmbed()
				.setTitle(`${user.username}'s Stats:`)
				.addField(`Cents:`, `${bal}`)
				.addField(`Inventory:`, `${organized.join('\n')}`)
				.addField(`Job:`, `${job}`)
				.addField(`Coins flipped:`, `${flips}`)
				.addField(`Minigames Won:`, `${wins}`)
				.addField(`Badges:`, `${badgesOrganized.join('\n')}`)
				.setColor("ORANGE");

			if (bio) embed.setDescription(bio);
			send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

			if (isNaN(bal) || bal == Infinity || bal == undefined) send.sendChannel({ channel: message.channel, author: message.author }, { content: "Hey, it looks like you have a bug in your balance! Please report it in the support server by doing `c!support` so we can make the bot better!" });
		}
	}
};