module.exports = async function checkGuild(firestore, guildId) {
	const Ref = await firestore.doc(`/guilds/${guildId}`).get();
	if (!Ref.data()) {
		await firestore.doc(`/guilds/${guildId}`).set({
			minigames: {
				in_game: false,
				starting: false,
				host: 0,
				looking_for: "NA",
				cheater: "NA",
				minigame_id: 0,
				channel_id: 0
			},
			enabled: {
				minigames: true,
				publiccreate: true,
				trash: true,
				karate: true,
				customaddons: true
			},
			serveraddons: {
				first: {
					name: "none",
					description: "none",
					published: false,
					author: 0
				},
				second: {
					name: "none",
					description: "none",
					published: false,
					author: 0
				},
				third: {
					name: "none",
					description: "none",
					published: false,
					author: 0
				}
			}
		});
	}
};