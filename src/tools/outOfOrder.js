module.exports = {
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let embed = new discord.MessageEmbed()
			.setTitle("🚫 Out of Order")
			.setDescription("Sorry, this command is out of order. It will be back as soon as possible!")
			.setColor('RED');
		send(embed);
	}
};