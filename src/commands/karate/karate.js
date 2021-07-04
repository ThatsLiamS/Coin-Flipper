const checkGuild = require("../../tools/checkGuild");
const fs = require("fs");

module.exports = {
	name: `karate`,
	description: "Train, level up, and battle your karate coin!",
	argument: "Optional: The karate command you want to use, and any other user mentions, IDs, or other arguments to go with them",
	perms: "Embed Links, Manage Messages",
	tips: "Use `c!help karate` and `c!karate tutorial` to get more info on karate commands",
	aliases: ["k"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {

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
		if (!cmd) return send("That's not an existing karate command! Use `c!help karate` and `c!karate tutorial` to see some of the commands!");

		if (msg.guild) {
			await checkGuild(firestore, msg.guild.id);
			let guildata = await firestore.doc(`/guilds/${msg.guild.id}`).get();
			if (guildata.data().enabled.karate === false) return;
		}
		let userData = data.data();
		let kd = userData.karate;
		if (kd.name == "NA" && cmd.name != "setup" && cmd.name != "tutorial") return send("Sorry, you must use `c!karate setup` first!");

		cmd.execute(firestore, args, command, msg, discord, data, send, kd, bot);
	}
};