const jwt = require("jsonwebtoken");

const secretKey = "my-secret-key";
function authenticateToken(req, res, next) {
	const token = req.cookies.authToken;
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, secretKey, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

module.exports = authenticateToken;
