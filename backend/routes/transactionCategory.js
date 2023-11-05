const express = require("express");
const router = express.Router();
const graphDBConnect = require("../middleware/graphDBConnect");
const formatResponse = require("../util");

router.post("/", async function (req, res) {
	const { category } = req.body;
	console.log(category);
	if (!category) {
		return res.status(400).send("Invalid Inputs");
	}
	const query = `CREATE (tc:TransactionCategory {category:$category}) RETURN tc`;
	const params = {
		category,
	};
	console.log(query);
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});

router.get("/", async function (req, res) {
	const query = "MATCH (tc:TransactionCategory) RETURN tc";
	const params = {};
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});

module.exports = router;
