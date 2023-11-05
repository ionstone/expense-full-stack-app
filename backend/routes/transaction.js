const express = require("express");
const router = express.Router();
const graphDBConnect = require("../middleware/graphDBConnect");
const formatResponse = require("../util");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", async function (req, res) {
	const { date, userId, type, category, amount, description } = req.body;

	const lastIdQuery =
		"MATCH (t:Transaction) RETURN t.id ORDER BY t.id DESC LIMIT 1";
	const lastIdResult = await graphDBConnect.executeCypherQuery(lastIdQuery);
	let lastId =
		lastIdResult.records.length > 0 ? lastIdResult.records[0].get("t.id") : 0;

	const id = lastId + 1; 
	console.log(
		"Adding Transaction::",
		id,
		date,
		userId,
		type,
		category,
		amount,
		description
	);

	if (!date || !userId || !type || !category || !amount) {
		return res.status(400).send("Invalid Inputs");
	}

	const query = `
        MATCH (u:Users {id:$userId})
        MERGE (tt:TransactionType {type:$type})
        MERGE (tc:TransactionCategory {category:$category})
        CREATE (t:Transaction {id:$id, date:$date,type:$type, category:$category, amount:$amount, description:$description})
        CREATE (u)-[:HAS_TRANSACTION]->(t)
        CREATE (t)-[:HAS_TYPE]->(tt)
        CREATE (t)-[:HAS_CATEGORY]->(tc)
        RETURN t
    `;

	const params = {
		id: id,
		date,
		userId: userId,
		type,
		category,
		amount: parseFloat(amount),
		description,
	};

	console.log(query);
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});

router.patch("/:id", authenticateToken, async function (req, res) {
	const { id } = req.params;
	const { date, type, category, amount, description } = req.body;
	console.log(
		"Updating Transaction::",
		id,
		date,
		type,
		category,
		amount,
		description
	);
	const query = `
        MATCH (t:Transaction {id:$id})
        SET t.date = $date,
            t.type = $type,
            t.category = $category,
            t.amount = $amount,
            t.description = $description
        RETURN t
    `;
	const params = {
		id: parseInt(id),
		date,
		type,
		category,
		amount: parseFloat(amount),
		description,
	};
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});

router.delete("/:id", authenticateToken, async function (req, res) {
	const { id } = req.params;
	console.log("Deleting Transaction::", id);
	const query = "MATCH (t:Transaction {id: $id}) DETACH DELETE t";
	const params = { id: parseInt(id) };
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	res.json({ message: "Delete success" });
});

module.exports = router;
