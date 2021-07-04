const profanities = ["bastard", "cunt", "bellend", "fanny", "cock", "nob", "shit", "bitch", "twat", "tosser", "cock", "pussy", "wanker", "dick", "fuck", "nigger", "nigga", "gook", "niger", "sex", "penis", "porn", "peen", "nude", "faggot", "vagina", "horny"];

module.exports.profanityCheck = async function profanityCheck(content) {
	let has = false;
	for (let profanity of profanities) {
		if (content.includes(profanity)) has = true;
	}
	return has;
};

module.exports.profanityCheckAddon = function profanityCheckAddon(addon, simple = true) {
	function findIt(content, profanity) {
		let firstIndex = content.indexOf(profanity);
		let lastIndex = firstIndex + profanity.length;
		let word = content.slice(firstIndex, lastIndex);
		let before = content.slice(0, firstIndex);
		let after = content.slice(lastIndex, content.length + 1);
		let annotated = `${before}__${word}__${after}`;
		return annotated;
	}
	let has = false;
	let places = [];
	for(const profanity of profanities) {
		if (addon.name.includes(profanity)) {
			has = true;
			if (simple == false) places.push(`Name: ${findIt(addon.name, profanity)}`);
		}
		if (addon.description.includes(profanity)) {
			has = true;
			if (simple == false) places.push(`Description: ${findIt(addon.name, profanity)}`);
		}
		for (const response of addon.responses) {
			if (response.includes(profanity)) {
				has = true;
				let foundIt = findIt(response, profanity);
				if (simple == false) places.push(`Response ${addon.responses.indexOf(response) + 1}: ${foundIt}`);
			}
		}
	}
	if (simple == true) return has;
	else return places;
};