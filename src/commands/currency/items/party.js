module.exports = {
	name: "party",
	description: "Party with a party popper for 1000 servers!",
	argument: "None",
	perms: "Embed Links, Attach Files",
	tips: "",
	aliases: ["partypopper", "popper", "streamer"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let userData = data.data();
		if (userData.inv.partypopper === undefined || userData.inv.partypopper == 0) return send("You don't have a party popper! It's illegal to celebrate without one!\nBuy one in the 1000 servers shop! (`c!limited`)");
		let extra = "";
		if (userData.celebrated === undefined) {
			extra = "\n\n**Here's 5000 cents, on us.**";
			userData.celebrated = true;
			userData.currencies.cents = userData.currencies.cents + 5000;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
		}
		let embed = new discord.MessageEmbed()
			.setTitle("Woooooooo!!")
			.setDescription(`1000 servers! Time to celebrate!${extra}`)
			.setImage("https://imgur.com/oOP7hRN.gif")
			.setColor("RANDOM");
		send(embed);
	}
};