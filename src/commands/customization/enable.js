const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "enable",
	description: "Enable a feature in your server!",
	argument: "The feature you want to enable",
	perms: "",
	tips: "You need the Manage Server permission to use this",
	aliases: ["enablefeature"],
	execute: async function(message, args, prefix, client, [firebase]) {

		if (!message.member.hasPermission('MANAGE_GUILD')) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, only users with the Manage Server permission can use this command!" });
		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you need to specify something that you want to enable.\nList: `flipping`, `minigames`, `publiccreate`, `trash`, `karate`, `customaddons`, `online`" });

		let feature = args[0];
		let featureList = ["flipping", "minigames", "publiccreate", "trash", "karate", "customaddons", "online", "trading"];

		if (!featureList.includes(feature)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not a valid feature! (use `c!help customization` for more info" });
		await checkGuild(firebase, message.guild.id);

		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		let guildData = guilddata.data();

		guildData["enabled"][feature] = true;
		await firebase.doc(`/guilds/${message.guild.id}`).set(guildData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `You disabled **${feature}**!` });
	}
};