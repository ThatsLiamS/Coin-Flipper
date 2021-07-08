const Discord = require('discord.js');

const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "register",
	description: "View the cents in your register!",
	argument: "None",
	perms: "Embed Links",
	tips: "You need a key to use this. Also, the register percent depends on your items, mode, and donator status.",
	aliases: ["reg"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		if (data.data().inv.key < 1) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You need a key to use this command!" });

		let percent = "10%";
		if (data.data().donator == 1) percent = "15%";
		if (data.data().donator == 2) percent = "25%";
		if (data.data().evil == true) percent = "7.5%";
		if (data.data().inv.label > 0 && (data.data().evil === false || data.data().evil === undefined)) {
			if (data.data().donator == 1) percent = "25%";
			else if (data.data().donator == 2) percent = "35%";
			else percent = "20%";
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username}'s Cash Register:`)
			.setDescription(`There are ${data.data().currencies.register} cents in this register!\nEvery time you flip a coin, **${percent}** of the amount goes into this register!`)
			.addField("Useful commands", "`c!withdraw` withdraw an amount of cents from the register\n`c!deposit` deposit an amount of cents into the register")
			.setColor('BLACK');

		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });

		let userData = data.data();
		if (data.data().registeredESent != true) {
			userData.registeredESent = true;
			await firebase.doc(`/users/${message.author.id}`).set(userData);
		}
	}
};