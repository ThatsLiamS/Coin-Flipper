module.exports = {
	name: "tutorial",
	aliases: ["help"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let embed1 = new discord.MessageEmbed()
			.setTitle("Welcome to Karate Coins! - Page 1/3")
			.setDescription("Karate Coins are coins that do karate! Finally, the thing you never knew you wanted! Using Karate Coins is simple - you train them, level them up, give them abilities, and fight with other players!")
			.addField("To Start", "Use the command `c!karate setup` to set up your coin! (choose their name and type - don't worry, you can always rename it using `c!karate rename`). Once you do that, you'll be able to use `c!karate` to view your coin! The color on the side of the embed is your karate coin's belt! You always start with a white belt and gradualy make your way up to a black belt!")
			.addField("Getting abilities", "You can see a full list of abilities using `c!karate abilities`! Then use `c!karate gain <ability>` to gain that ability! Remember that you have to be at the required skill level to gain an ability! The **flip** ability can be gained from the start!")
			.addField("Training", "To train your coin, you have to do 2 things. First, get the **flip** ability! (look above if you don't know how). Then use the flip addon: `c!flip train` to train your coin!")
			.setFooter("Use \"c!karate tutorial <page>\" to switch to a different page")
			.setColor('RED');
		let embed2 = new discord.MessageEmbed()
			.setTitle("Items - Page 2/3")
			.addField("Buying Items", "Go to the karate shop using `c!karate shop`! There you will find some items that will help you in battle. They can regain different stats. To buy an item, use `c!karate buy <item>`. Remember that items are crucial to karate battles!")
			.setFooter("Use \"c!karate tutorial <page>\" to switch to a different page")
			.setColor('RED');
		let embed3 = new discord.MessageEmbed()
			.setTitle("Battles - Page 3/3")
			.addField("Ask to battle", "Use `c!karate battle <user>` to ask a user to battle! They can then use `c!karate accept` or `c!karate decline` to accept or decline.")
			.addField("Choosing your abilities", "If you have more than 3 abilities, you'll have to use the `c!choose <ability>` command in your DMs! You can only choose 3 abilities for one game, so choose wisely! If you have 3 or less abilities, they will automatically be chosen.")
			.addField("In-battle", "A karate battle is turn-based. On your turn, you can either attack with one of your abilities (`c!karate attack`) or use an item that you bought previously (`c!karate use <item>`). Remember that using abilities will cost stamina, so make sure to never run out. If you run out of stamina and don't have any items left, you can use `c!karate skip` to skip your turn.")
			.addField("Winning", "Whenever a karate coin gets to 0 HP or someone surrenders (`c!karate surrender`), the game is over and the other player has won. The winner gets 20 XP for their karate coin.")
			.setFooter("Use \"c!karate tutorial <page>\" to switch to a different page")
			.setColor('RED');

		if (args[1] == 3) {
			send(embed3);
		}
		else if (args[1] == 2) {
			send(embed2);
		}
		else {
			send(embed1);
		}
	}
};