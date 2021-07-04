module.exports = {
	name: "status",
	description: "Check your status and see how items you have help you!",
	argument: "None",
	perms: "Embed Links",
	tips: "This will be a combination of effects from different items in your inventory",
	aliases: ["powers", "powerups", "effects", "effect"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let embed = new discord.MessageEmbed()
			.setTitle(`${msg.author.username}'s Status:`)
			.setColor('GREEN');
		let userData = data.data();
		if (userData.currencies.multiplier > 1) {
			if (userData.donator > 0) {
				if (userData.currencies.multiplier == 2.5) embed.setDescription("<:gold:807241733162270810> Being a donator gives you a 2.5x flip multiplier!");
				else embed.setDescription("<:gold:807241733162270810> Being a donator gives you a 2.5x flip multiplier!\nYou also got a 1.5x flip multiplier from the 🥤 smoothie, having a total of 3x!");
			}
			else {
				embed.setDescription(`You have a 1.5x flip multiplier from the 🥤 smoothie!`);
			}
		}
		if (userData.inv.bronzecoin > 0) embed.addField("🥉 Bronze Coin", "Can use the PENNY addon (`c!flip penny`)");
		if (userData.inv.silvercoin > 0) embed.addField("🥈 Silver Coin", "Can use the DIME addon (`c!flip dime`)");
		if (userData.inv.goldcoin > 0) embed.addField("🥇 Gold Coin", "Can use the DOLLAR addon, which gives 1.5x more cents (`c!flip dollar`)");
		if (userData.inv.kcoin > 0) embed.addField("🏅 24k Gold Medal", "Can use the 24 addon, which has a 5% greater chance to get a briefcase (`c!flip 24`)");
		if (userData.inv.golddisk > 0) embed.addField("📀 Gold Disk", "Gives 2x more cents when flipping");
		if (userData.inv.platinumdisk > 0) {
			if (userData.inv.golddisk > 0) {
				embed.addField("💿 Platinum Disk", "Gives 3x more cents when flipping (note that it does not overlap with the gold disk)");
			}
			else{
				embed.addField("💿 Platinum Disk", "Gives 3x more cents when flipping");
			}
		}
		if (userData.inv.luckypenny > 0) embed.addField("🍀 Lucky Clover", "Has a better chance of winning the lottery");
		if (userData.inv.packages > 0) embed.addField("📦 Package", "Gives more cents when dropshipping");
		if (userData.inv.compass > 0) embed.addField("🧭 Compass", "Has a better chance of getting cents when exploring");
		if (userData.inv.controller > 0) embed.addField("🎮 Controller", "Gives 5x more cents when winning minigames");
		if (userData.inv.hammer > 0) embed.addField("⚒️ Hammer", "Gives more cents and rocks when mining");
		if (userData.inv.label > 0) embed.addField("🏷️ Label", "Gives 10% more cents in your register");
		if (userData.inv.clipboard > 0) embed.addField("📋 Clipboard", "Gives 1.5x more cents when working");
		send(embed);
	}
};