const joblist = require("../../../tools/constants").joblist;
module.exports = {
	name: "jobs",
	description: "Get a list of jobs you can apply for!",
	argument: "None",
	perms: "Embed Links",
	tips: "",
	aliases: ["joblist"],
	execute: async function(firestore, args, command, msg, discord, data, send) {
		let fields = joblist.map(item => {
			return { name: `${item.emoji} ${item.name}`, value: `\`Description:\` ${item.description}\n\`Experience:\` ${item.experience}`, inline: true };
		});
		if(data.data().stats.timesWorked < 15) { fields = fields.slice(0, 3); }
		else if (data.data().stats.timesWorked < 30) { fields = fields.slice(0, 6); }
		let embed = new discord.MessageEmbed()
			.setTitle("Jobs:")
			.addFields(fields)
			.setColor('BLUE')
			.setFooter("Use c!job <job> to get a job!");
		send(embed);
	}
};