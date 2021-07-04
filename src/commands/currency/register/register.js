module.exports = {
	name: "register",
	description: "View the cents in your register!",
	argument: "None",
	perms: "Embed Links",
	tips: "You need a key to use this. Also, the register percent depends on your items, mode, and donator status.",
	aliases: ["reg"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		if (data.data().inv.key < 1) return send("You need a key to use this command!");
		let percent = "10%";
		if (data.data().donator == 1) percent = "15%";
		if (data.data().donator == 2) percent = "25%";
		if (data.data().evil == true) percent = "7.5%";
		if (data.data().inv.label > 0 && (data.data().evil === false || data.data().evil === undefined)) {
			if (data.data().donator == 1) percent = "25%";
			else if (data.data().donator == 2) percent = "35%";
			else percent = "20%";
		}
		let embed = new discord.MessageEmbed()
			.setTitle(`${msg.author.username}'s Cash Register:`)
			.setDescription(`There are ${data.data().currencies.register} cents in this register!\nEvery time you flip a coin, **${percent}** of the amount goes into this register!`)
			.addField("Useful commands", "`c!withdraw` withdraw an amount of cents from the register\n`c!deposit` deposit an amount of cents into the register")
			.setColor('BLACK');
		send(embed);
		let userData = data.data();
		if (data.data().registeredESent != true) {
			userData.registeredESent = true;
			await firestore.doc(`/users/${msg.author.id}`).set(userData);
		}
	}
};