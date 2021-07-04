const itemlist = require("./constants").itemlist;
module.exports = function(args) {
	let itemName = args[0];
	let item;
	function findItem(itemName) {
		for (let i of itemlist) {
			if (i.name == itemName) item = i;
			if (i.aliases.includes(itemName)) item = i;
		}
	}
	let done = false;
	for (let i = 0; i < 5; i++) {
		if (done == false) {
			itemName = args.slice(0, i + 1).join(" ");
			findItem(itemName);
			if (item !== undefined) done = true;
		}
	}
	let amt = Number(args[1]);
	if (isNaN(amt) || amt === undefined) amt = Number(args[2]);
	if (isNaN(amt) || amt === undefined) amt = Number(args[3]);
	if (isNaN(amt) || amt === undefined) amt = Number(args[4]);
	if (isNaN(amt) || amt === undefined) amt = Number(args[5]);
	if (isNaN(amt) || amt === undefined) amt = 1;

	return [item, amt];
};