module.exports = {
	name: "ready",
	once: true,
	execute: function(client) {

		client.user.setPresence({
			status: "online",
			activities: [{ type: `WATCHING`, name: `coins flip in ${client.shard.count} shards` }]
		});

		console.log(`Shard ${client.shard.ids} ready`);

	}
};