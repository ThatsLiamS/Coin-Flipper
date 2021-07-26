const checkGuild = require(`${__dirname}/../../tools/checkGuild`);
const send = require(`${__dirname}/../../tools/send`);

module.exports = {
	name: "setcost",
	description: "Set the cost of one of your custom addons!",
	argument: "The addon name and the cost",
	perms: "",
	tips: "Custom addons have to be enabled to use this, and the cost cannot be over 500 cents",
	aliases: ["cost", "setprice", "price"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		await checkGuild(firebase, message.guild.id);
		let guilddata = await firebase.doc(`/guilds/${message.guild.id}`).get();
		if (guilddata.data().enabled.customaddons == false) return;

		let userData = data.data();
		let cd = userData.addons.customaddons;

		if (!args[0] || !args[1]) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Phrase the command like this: `c!setcost <addon name> <cost>`" });

		let name = args[0];
		if (name == "none") return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		let cost = args[1];
		if (isNaN(cost)) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "The cost has to be a number!" });
		if (cost < 0 || cost % 1 != 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "The cost has to be a valid number!" });
		if (cost > 500 && userData.donator == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "The max cost is 500 cents.\nDon't be greedy (unless you're a donator - then be greedy and make it 1500 cents)" });
		if (cost > 1500) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "The max cost is 1500 cents" });

		let exists = false;
		let path = false;
		if (cd.first.name.toLowerCase() == name) {
			exists = cd.first;
			path = "first";
		}
		if (cd.second.name.toLowerCase() == name) {
			exists = cd.second;
			path = "second";
		}
		if (cd.third.name.toLowerCase() == name) {
			exists = cd.third;
			path = "third";
		}

		if (exists == false) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "That's an invalid addon name!" });

		if (exists.cost == cost) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "Your addon already has that cost!" });

		cd[path]["cost"] = cost;

		userData.addons.customaddons = cd;
		await firebase.doc(`/users/${message.author.id}`).set(userData);

		send.sendChannel({ channel: message.channel, author: message.author }, { content: `Successfully set it to: \`${cost}\` cents!` });
	}
};