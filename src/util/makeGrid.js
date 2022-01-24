const fitString = (str, length) => {
	return str + ' '.repeat(length -= str.length);
};

const border = '+----+----------+----------+---------+';
const title = '| ID |   PING   | SERVERS  |  USERS  |';
const length = [8, 7, 7];

module.exports = (results) => {
	const rows = [];

	for (let y = 0; y < results[0].length; y++) {
		const values = [y + 1];

		for (let x = 0; x < 3; x++) {
			if (x == '0') {
				let num = results[x][y].toString();
				if (num.length == 2) { num = 0 + num; }

				values.push(`${num} ms  `);
			}
			else { values.push(fitString(results[x][y].toString(), length[x])); }
		}
		rows[y] = `| ${values[0]}  |  ${values[1]}|   ${values[2]}|  ${values[3]}|`;
	}

	let grid = `${border}\n${title}\n${border}\n`;
	for (const row of rows) grid += `${row}\n`;
	grid += `${border}`;

	return grid;
};
