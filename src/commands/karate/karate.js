const fs = require("fs");

const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: `karate`,
	description: "Train, level up, and battle your karate coin!",
	argument: "Optional: The karate command you want to use, and any other user mentions, IDs, or other arguments to go with them",
	perms: "Embed Links, Manage Messages",
	tips: "Use `c!help karate` and `c!karate tutorial` to get more info on karate commands",
	aliases: ["k"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		const commands = {};
		const categories = fs.readdirSync(`${__dirname}/../../commands/karate`).filter(file => !file.endsWith(".js"));
		for (let category of categories) {
			if (category != "k_tools") {
				const commandFiles = fs.readdirSync(`${__dirname}/../../commands/karate/${category}`).filter(file => file.endsWith('.js'));
				for (let file of commandFiles) {
					const cmd = require(`${__dirname}/../../commands/karate/${category}/${file}`);
					commands[cmd.name] = cmd;
					if (cmd.aliases) {
						cmd.aliases.forEach(alias => {
							commands[alias] = cmd;
						});
					}
				}
			}
		}

		let karateCmd = args[0];
		let cmd = commands[karateCmd];
		if (!args[0]) cmd = commands.karate;

		if (!cmd) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's not an existing karate command! Use `c!help karate` and `c!karate tutorial` to see some of the commands!" });

		if (message.guild) {

			await checkGuild(firebase, message.guild.id);

			let guildata = await firebase.doc(`/guilds/${message.guild.id}`).get();
			if (guildata.data().enabled.karate === false) return;
		}

		let userData = data.data();
		let kd = userData.karate;

		if (kd.name == "NA" && cmd.name != "setup" && cmd.name != "tutorial") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Sorry, you must use `c!karate setup` first!" });

		cmd.execute(message, args, prefix, client, kd, [firebase, data]);
	}
};