const checkGuild = require("../../tools/checkGuild");
const checkOnline = require("../../tools/checkOnline");
module.exports = {
	name: "deleteaddon",
	description: "Delete a custom addon or bought addon!",
	argument: "The name of the addon you want to delete!",
	perms: "",
	tips: "Custom addons have to be enabled to use this",
	aliases: ["delete", "destroy", "destroyaddon", "removeaddon", "remove"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let name = args[0];
		if (!name) return send("You need to specify the name of the addon you want to delete!");
		if (name == "none") return send("That's not a valid addon!");

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

		if (exists.published == true) return send("You already published your addon! You can't delete it! If you want to scrape it from the addon shop, please contact Coin Flipper developers in the support server! (`c!support`)");

		let array = await checkOnline(firestore, msg.author.id, userData);
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

		if (exists == false) return send("That's not a valid addon!");

		send(`Are you sure you want to delete the addon **${exists.name}**?\n\`yes\` or \`no\``);

		msg.channel.awaitMessages(m => m.author.id == msg.author.id, { max: 1, time: 10000 }).then(async collected => {
			if (!collected.first()) {
				return send("You didn't answer :/");
			}
			let message = collected.first().content.toLowerCase();
			if (message != "yes" && message != "no") { return send("That's not a valid choice!"); }
			if (message == "no") {return send("Um ok then"); }
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
				await firestore.doc(`/users/${msg.author.id}`).set(userData);
				send(`You deleted your addon **${exists.name}**!`);
			}
		});
	}
};