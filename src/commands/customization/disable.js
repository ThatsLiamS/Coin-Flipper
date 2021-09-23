const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "disable",
	description: "Disable a feature in your server!",
	argument: "The feature you want to disable",
	perms: "",
	permissions: ['Manage Guild'],
	tips: "you need the Manage Server permission to use this",
	aliases: ["disablefeature"],
	execute: async function(message, args, prefix, client, [firebase]) {

		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you need to specify something that you want to disable.\nList: `flipping`, `minigames`, `publiccreate`, `trash`, `karate`, `customaddons`, `online`" });

		let feature = args[0];
		let featureList = ["flipping", "minigames", "publiccreate", "trash", "karate", "customaddons", "online", "trading"];

		if (!featureList.includes(feature)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid feature! (use `c!help customization` for more info" });
		await checkGuild(firebase, message.guild.id);

		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		let guildData = guilddata.data();

		// if (guildData["enabled"][feature] == false) return send("That feature is already disabled!");

		guildData["enabled"][feature] = false;
		await firebase.doc(`/guilds/${message.guild.id}`).set(guildData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You disabled **${feature}**!` });
	}
};