const Discord = require('discord.js');

const send = require(`${__dirname}/../../../tools/send`);

module.exports = {
	name: "party",
	description: "Party with a party popper for 1000 servers!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	tips: "",
	aliases: ["partypopper", "popper", "streamer"],
	execute: async function(message, args, prefix, client, [firebase, data]) {

		let userData = data.data();
		if (userData.inv.partypopper === undefined || userData.inv.partypopper == 0) return send.sendChannel({ channel: message.channel, author: message.author }, { content: "You don't have a party popper!" });
		let extra = "";
		if (userData.celebrated === undefined) {
			extra = "\n\n**Here's 5000 cents, on us.**";
			userData.celebrated = true;
			userData.currencies.cents = userData.currencies.cents + 5000;
			await firebase.doc(`/users/${message.author.id}`).set(userData);
		}
		const embed = new Discord.MessageEmbed()
			.setTitle("Woooooooo!!")
			.setDescription(`1000 servers! Time to celebrate!${extra}`)
			.setImage("https://imgur.com/oOP7hRN.gif")
			.setColor("RANDOM");
		send.sendChannel({ channel: message.channel, author: message.author }, { embeds: [embed] });
	}
};