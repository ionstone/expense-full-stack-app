const express = require("express");
const router = express.Router();
const graphDBConnect = require("../middleware/graphDBConnect");
const formatResponse = require("../util");

router.post("/", async function (req, res) {
	const { type } = req.body;
	console.log(type);
	if (!type) {
		return res.status(400).send("Invalid Inputs");
	}
	const query = `CREATE (tt:TransactionType {type:$type}) RETURN tt`;
	const params = {
		type,
	};
	console.log(query);
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});

router.get("/", async function (req, res) {
	const query = "MATCH (tt:TransactionType) RETURN tt";
	const params = {};
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});

module.exports = router;
