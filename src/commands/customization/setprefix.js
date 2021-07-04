module.exports = {
	name: "setprefix",
	description: "Set a custom prefix for your server!",
	argument: "The new prefix",
	perms: "",
	tips: "You need the Manage Server permission to use this",
	aliases: ["prefix", "changeprefix"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		if (!msg.member.hasPermission('MANAGE_GUILD')) return send("Sorry, only users with the Manage Server permission can use this command!");
		if (!args[0]) return send("Sorry, you need to specify a new prefix for your server!");
		if (args[1]) return send("The prefix cannot contain spaces!");
		let prefix = args[0];
		bot.prefixes.set(msg.guild.id, prefix, "prefix");
		send(`The prefix is now **${prefix}**!`);
	}
};