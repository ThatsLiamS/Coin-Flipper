module.exports = async function checkOnline(firestore, userId, data) {

	let huh = data.online == undefined;
	if (huh == true) {
		let onlinedata = await firestore.doc(`/online/codes`).get();
		let onlineData = onlinedata.data();
		let codes = onlineData.codes;
		let lastCode = codes[codes.length - 1];
		if (isNaN(lastCode)) lastCode = 0;
		let newCode;

		function getCode() {
			let exists = false;
			let localCode = Number(lastCode) + Number(1);
			for (let code of codes) {
				if (code == newCode) exists = true;
			}
			if (exists == true) {
				lastCode = Number(lastCode) + Number(1);
				getCode();
			}
			else {
				newCode = localCode;
			}
		}

		getCode();
		newCode = Number(newCode);
		codes.push(newCode);
		onlineData.codes = codes;
		onlineData[newCode] = userId;
		await firestore.doc(`/online/codes`).set(onlineData);
		data.online = {
			online: true,
			addonInv: {
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
			},
			credits: 0,
			betsWon: 0,
			friendCode: newCode
		};
		await firestore.doc(`/users/${userId}`).set(data);
	}
	let onlineEnabled = data.online.online;
	let array = [onlineEnabled, data];
	return array;
};
