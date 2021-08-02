module.exports = {
	name: 'guildCreate',
	execute: async function(guild, client) {

		const promises = [
			client.shard.fetchClientValues('guilds.cache.size'),
		];
		const results = await Promise.all(promises);

		const servers = results[0].reduce((acc, guildCount) => acc + guildCount, 0);

		client.user.setPresence({
			status: "online",
			activity: {
				type: `WATCHING`,
				name: `coins flip in ${servers} servers`
			}
		});
	}
};