module.exports = async function check(firestore, userId) {
	const Ref = await firestore.doc(`/users/${userId}`).get();
	if (!Ref.data()) {
		await firestore.doc(`/users/${userId}`).set({
			user: userId,
			job: "none",
			currencies: {
				cents: 0,
				register: 0,
				multiplier: 0
			},
			inv: {
				toolbox: false,
				bronzecoin: 0,
				silvercoin: 0,
				goldcoin: 0,
				kcoin: 0,
				golddisk: 0,
				platinumdisk: 0,
				calendar: 0,
				goldtrophy: 0,
				luckypenny: 0,
				vault: 0,
				packages: 0,
				compass: 0,
				broken8ball: 0,
				key: 0,
				bandaid: 0,
				soap: 0,
				fuel: 0,
				briefcase: 0
			},
			badges: {
				dev: false,
				partnered_dev: false,
				support: false,
				flip: false,
				flip_plus: false,
				minigame: false,
				minigame_plus: false,
				register: false,
				collector: false,
				collector_plus: false,
				rich: false,
				rich_plus: false,
				bughunter: false,
				bughunter_plus: false
			},
			stats: {
				flipped: 0,
				minigames_won: 0,
				timesWon: 0,
				timesWorked: 0
			},
			cooldowns: {
				work: 0,
				daily: 0,
				vote: 0,
				weekly: 0,
				monthly: 0,
				claimed: 0,
				flipCooldown: false,
				dropshipCooldown: false,
				exploreCooldown: false,
				lotteryCooldown: false
			},
			lottery: {
				id: 0,
				won: false,
				prize: 0
			},
			karate: {
				abilities: {
					flip: false,
					spin: false,
					slide: false,
					dive: false,
					swipe: false,
					slice: false
				},
				name: "NA",
				type: "NA",
				belt: "NA",
				xp: 0,
				level: 0,
				battles: {
					in_battle: false,
					against: 0,
					askedTo: 0,
					askedBy: 0,
					hp: 0,
					st: 0,
					mhp: 0,
					mst: 0,
					choosing: false,
					first: false,
					guild: 0,
					channel: 0,
					turn: false,
					chosen: {
						flip: false,
						spin: false,
						slide: false,
						dive: false,
						swipe: false,
						slice: false
					}
				}
			},
			addons: {
				customaddons: {
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
			},
			donator: 0
		});
	}
};