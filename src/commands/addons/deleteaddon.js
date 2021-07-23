const Discord = require('discord.js');

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const checkOnline = require(`${__dirname}/../../tools/checkOnline`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "deleteaddon",
	description: "Delete a custom addon or bought addon!",
	argument: "The name of the addon you want to delete!",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["delete", "destroy", "destroyaddon", "removeaddon", "remove"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let name = args[0];
		if (!name) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need to specify the name of the addon you want to delete!" });
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		let userData = data.data();
		let cd = userData.addons.customaddons;

		let exists = false;
		let type = "custom";
		if (cd.first.name.toLowerCase() == name) {
			exists = cd.first;
		}
		if (cd.second.name.toLowerCase() == name) {
			exists = cd.second;
		}
		if (cd.third.name.toLowerCase() == name) {
			exists = cd.third;
		}

		if (exists.published == true) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You already published your addon! You can't delete it! If you want to scrape it from the addon shop, please contact Coin Flipper developers in the support server! (`c!support`)" });

		let array = await checkOnline(firebase, message.author.id, userData);
		let online = array[0];
		userData = array[1];

		if (online == true) {
			let addonInv = userData.online.addonInv;
			if (addonInv.first.name.toLowerCase() == name) {
				exists = addonInv.first;
				type = "online";
			}
			if (addonInv.second.name.toLowerCase() == name) {
				exists = addonInv.second;
				type = "online";
			}
			if (addonInv.third.name.toLowerCase() == name) {
				exists = addonInv.third;
				type = "online";
			}
		}

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid addon!" });

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `Are you sure you want to delete the addon **${exists.name}**?\n\`yes\` or \`no\`` });

		message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000 }).then(async collected => {
			if (!collected.first()) {
				send.sendChannel({ channel: message.channel, author: message.author }, { content: "You didn't answer :/" });
				return;
			}
			message = collected.first().content.toLowerCase();
			if (message != "yes" && message != "no") { return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid choice!" }); }
			if (message == "no") { return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Um ok then" }); }
			else {
				if (type == "custom") {
					if (cd.first.name == exists.name) {
						cd.first = {
							name: "none",
							description: "",
							cost: 0,
							published: false,
							author: 0
						};
					}
					if (cd.second.name == exists.name) {
						cd.second = {
							name: "none",
							description: "",
							cost: 0,
							published: false,
							author: 0
						};
					}
					if (cd.third.name == exists.name) {
						cd.third = {
							name: "none",
							description: "",
							cost: 0,
							published: false,
							author: 0
						};
					}
				}
				else {
					if (userData.online.addonInv.first.name == exists.name) {
						userData.online.addonInv.first = {
							name: "none",
							description: "",
							cost: 0,
							published: false,
							author: 0
						};
					}
					if (userData.online.addonInv.second.name == exists.name) {
						userData.online.addonInv.second = {
							name: "none",
							description: "",
							cost: 0,
							published: false,
							author: 0
						};
					}
					if (userData.online.addonInv.third.name == exists.name) {
						userData.online.addonInv.third = {
							name: "none",
							description: "",
							cost: 0,
							published: false,
							author: 0
						};
					}
				}
				userData.addons.customaddons = cd;
				await firebase.doc(`/users/${message.author.id}`).set(userData);

				const embed = new Discord.MessageEmbed()
					.setTitle('Deleted addon')
					.setDescription(`You deleted your addon **${exists.name}**!`);
				send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

			}
		});
	}
};