module.exports = {
	name: 'guildCreate',
	execute: async function(guild, client) {

		client.user.setPresence({
			status: "online",
			activity: {
				type: `WATCHING`,
				name: `coins flip in ${client.guilds.cache.size} servers`
			}
		});
	}
};