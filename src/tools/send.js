async function sendChannel(values, object) {
	const channel = values.channel;
	const author = values.user;

	let message = object.content ? object.content : object.embeds[0]

	let result = true;

	await channel.send(message).catch(() => {
		result = false;
		sendUser(author, { content: `An error occured when sending a message in ${channel}.\nPlease make sure I have permission to \`SEND_MESSAGES\` and \`EMBED_LINKS\`.` });
	});

	return result;
}

async function sendUser(user, object) {
	let result = true;

	if(!user || user == 'n/a') { return result; }

	let message = object.content ? object.content : object.embeds[0]

	await user.send(message).catch(() => {
		result = false;
	}).catch();

	return result;
}


module.exports = {
	sendChannel,
	sendUser
};