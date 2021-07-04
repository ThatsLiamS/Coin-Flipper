const checkGuild = require("../../../tools/checkGuild");
const checkOnline = require("../../../tools/checkOnline");
module.exports = {
	name: "addonshop",
	description: "View the worldwide Addon Shop!",
	argument: "Optional: embed page",
	perms: "Embed Links",
	tips: "Online and custom addons have to be enabled to use this",
	aliases: ["addonstore"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		await checkGuild(firestore, msg.guild.id);
		let guilddata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
		if (guilddata.data().enabled.online === false) return;
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();

		let array = await checkOnline(firestore, msg.author.id, userData);
		userData = array[1];
		let online = array[0];
		if (online == false) return;

		let embed = new discord.MessageEmbed()
			.setTitle("CoinTopia Addon Shop")
			.setColor("#912bff");

		let addons = await firestore.doc(`/online/addons`).get();
		let addonShop = addons.data().addons;
		if (addonShop) {
			let hugeArray = [];
			let alreadyAdded = [];
			if (addonShop.length > 4) {
				for (let item of addonShop) {
					if ((addonShop.indexOf(item) + 1) % 5 == 0) {
						let index = addonShop.indexOf(item);
						let last1 = addonShop[index - 1];
						let last2 = addonShop[index - 2];
						let last3 = addonShop[index - 3];
						let last4 = addonShop[index - 4];
						hugeArray.push([item, last1, last2, last3, last4]);
						alreadyAdded.push(last4);
						alreadyAdded.push(last3);
						alreadyAdded.push(last2);
						alreadyAdded.push(last1);
						alreadyAdded.push(item);
					}
					else if (addonShop.indexOf(item) == addonShop.length - 1) {
						let index = addonShop.indexOf(item);
						let last1 = addonShop[index - 1];
						let last2 = addonShop[index - 2];
						let last3 = addonShop[index - 3];
						let last4 = addonShop[index - 4];
						if (alreadyAdded.includes(last1)) {
							hugeArray.push([item]);
						}
						else if (alreadyAdded.includes(last2)) {
							hugeArray.push([item, last1]);
						}
						else if (alreadyAdded.includes(last3)) {
							hugeArray.push([item, last1, last2]);
						}
						else if (alreadyAdded.includes(last4)) {
							hugeArray.push([item, last1, last2, last3]);
						}
						else {
							hugeArray.push([item, last1, last2, last3, last4]);
						}
					}
				}
			}
			else {
				hugeArray = [[]];
				for (let item of addonShop) {
					hugeArray[0].push(item);
				}
			}
			let page = args[0];
			if (!page) page = 1;
			array = hugeArray[page - 1];
			if (!array) array = hugeArray[0];
			for (let addon of array) {
				embed.addField(addon.name, `Description: ${addon.description}\nResponses: ${addon.responses.length}\nCost: ${addon.cost}\nAuthor: ${addon.author}`);
			}
			embed.setTitle(`CoinTopia Addon Shop - Page ${page}/${hugeArray.length}`);
		}
		else {
			embed.setDescription("Nothing's here...");
		}
		send(embed);
	}
};