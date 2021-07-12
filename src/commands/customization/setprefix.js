const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "setprefix",
	description: "Set a custom prefix for your server!",
	argument: "The new prefix",
	perms: "",
	tips: "You need the Manage Server permission to use this",
	aliases: ["prefix", "changeprefix"],
	execute: async function(message, args, prefix, client) {

		if (!message.member.hasPermission('MANAGE_GUILD')) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, only users with the Manage Server permission can use this command!" });

		if (!args[0]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you need to specify a new prefix for your server!" });
		if (args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "The prefix cannot contain spaces!" });

		const newPrefix = args[0];
		client.prefixes.set(message.guild.id, newPrefix, "prefix");

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `The prefix is now **${newPrefix}**!` });

	}
};