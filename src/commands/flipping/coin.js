const canvas = require("canvas");
module.exports = {
	name: "coin",
	description: "Add your or someone else's profile picture to a coin!",
	argument: "Optional: a user mention or user ID",
	perms: "Embed Links, Attach Files",
	tips: "",
	aliases: ["coinme"],
	execute: async function(firestore, args, command, msg, discord, data, send, bot) {
		let user = msg.mentions.users.first();
		if (!user) {
			if (args[0]) {
				if (!isNaN(args[0])) {
					user = bot.users.cache.get(args[0]);
					if (!user) user = msg.author;
				}
				else{
					user = msg.author;
				}
			}
			else{
				user = msg.author;
			}
		}
		const mycanvas = canvas.createCanvas(500, 500);
		const ctx = mycanvas.getContext("2d");
		const background = await canvas.loadImage("https://imgur.com/2vW4pXy.jpg");
		ctx.drawImage(background, 0, 0, mycanvas.width, mycanvas.height);

		ctx.beginPath();
		ctx.arc(255, 250, 180, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();

		const avatar = await canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
		ctx.drawImage(avatar, 75, 65, 375, 375);

		// let attachment = new discord.MessageAttachment(mycanvas.toBuffer(), `${user.id}-coin-image.png`);
		//send(`**The coin landed on ${user.username}**`, attachment);

		send({
			embed: {
				title: `The coin landed on ${user.username}`,
				color: "YELLOW",
				image: {
					url: "attachment://coin-image.png"
				}
			},
			files: [{
				attachment: mycanvas.toBuffer(),
				name: "coin-image.png"
			}]
		});
	}
};