const neo4j = require("neo4j-driver");
const config = require("config");
const uri = config.get("dbHost");
const user = config.get("dbUser");
const password = config.get("dbPass");
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function executeCypherQuery(statement, params = {}) {
	try {
		console.log("executeCypherQuery:", statement, params);
		const session = driver.session();
		const result = await session.run(statement, params);
		session.close();
		return result;
	} catch (error) {
		console.log(error);
		
	}
}
module.exports = { executeCypherQuery };
