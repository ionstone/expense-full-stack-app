function formatResponse(resultObj) {
	const result = [];
	if (resultObj.records.length > 0) {
		resultObj.records.map((record) => {
			result.push(record._fields[0].properties);
		});
	}
	return result;
}

module.exports = formatResponse;
