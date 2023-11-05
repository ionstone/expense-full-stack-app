const express = require("express");
const router = express.Router();
const graphDBConnect = require("../middleware/graphDBConnect");
const authenticateToken = require("../middleware/authMiddleware");

const formatResponse = require("../util");

router.post("/", async function (req, res) {
	const { id, name, email } = req.body;
	console.log(id, name, email);
	if (!id || id < 1 || !name || !email) {
		return res.status(400).send("Invalid Inputs");
	}
	const query = `CREATE (n:Users {id:$id, name:$name, email: $email}) RETURN n`;
	const params = {
		id: parseInt(id),
		name,
		email,
	};
	console.log(query);
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});
router.get("/", async function (req, res) {
	const query = "MATCH (n:Users) RETURN n";
	const params = {};
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});
router.get("/:id", async function (req, res) {
	const { id } = req.params;
	const query = "MATCH (n:Users {id: $id}) RETURN n";
	const params = { id: id };
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});

router.get("/:id/transactions", authenticateToken, async function (req, res) {
	const { id } = req.params;
	const query =
		"MATCH (u:Users {id: $id})-[:HAS_TRANSACTION]->(t:Transaction) RETURN t ORDER BY t.date";
	const params = { id: id };
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	const result = formatResponse(resultObj);
	res.send(result);
});


router.delete("/:id", async function (req, res) {
	const { id } = req.params;
	const query = "MATCH (n:Users {id: $id}) DELETE n";
	const params = { id: parseInt(id) };
	const resultObj = await graphDBConnect.executeCypherQuery(query, params);
	res.send("Delete success");
});
module.exports = router;
