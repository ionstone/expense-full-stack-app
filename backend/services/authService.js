const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const graphDBConnect = require("../middleware/graphDBConnect");

var service = {};
const secretKey = "my-secret-key";
service.loginService = loginService;
service.logoutService = logoutService;
service.registrationService = registrationService;

module.exports = service;

function generateToken(account) {
	const payload = { id: account.personId, username: account.firstName };
	return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

function registrationService(req, res) {
	return new Promise(async (resolve, reject) => {
		try {
			console.log("Userdate::", req.body);
			const email = req.body.email;
			const name = req.body.name.trim();
			const password = bcrypt.hashSync(req.body.password);

			const preQuery = `match(p:Users{email:$email})return p`;
			const preResult = await graphDBConnect.executeCypherQuery(preQuery, {
				email: email,
			});

			if (!preResult.records.length) {
				const query = `CREATE (n:Users {id:apoc.create.uuid(),
            email:$email, 
            name:$name, 
            password:$password
        }) return n`;

				graphDBConnect
					.executeCypherQuery(query, {
						name: name,
						email: email,
						password: password,
					})
					.then((result) => {
						if (result.records.length > 0) {
							resolve({ stat: true, message: "User registered successfully" });
						} else {
							reject({ stat: false, message: "Error in user Registration" });
						}
					})
					.catch((error) => {
						console.log("Error in user registration::", error);
					});
			} else {
				resolve({ stat: false, message: "User with this email already exist" });
			}
		} catch (error) {
			console.log("Error in user registration::", error);
			reject({
				stat: false,
				error: error,
				message: "Error in user Registration",
			});
		}
	});
}

function loginService(req, res) {
	return new Promise((resolve, reject) => {
		try {
			const email = req.body.email;
			const password = req.body.password;
			const query = `match(p:Users{email:$email}) return properties(p) as prop`;
			graphDBConnect
				.executeCypherQuery(query, { email: email })
				.then((result) => {
					if (result.records.length > 0) {
						const dbPassword = result.records[0].get("prop").password;
						const isUserAuthenticated = bcrypt.compareSync(
							password,
							dbPassword
						);
						if (isUserAuthenticated) {
							const { password, ...account } = result.records[0].get("prop");
							const token = generateToken(account);
							console.log(account);
							res.cookie("authToken", token, {
								httpOnly: true,
								secure: true,
								domain: "localhost",
								path: "/",
							});
							resolve({ stat: true, data: account });
						} else {
							reject({ stat: false, message: "Invalid Credentials" });
						}
					} else {
						reject({ stat: false, message: "Invalid Credentials" });
					}
				})
				.catch((error) => {
					console.log("Error in login::", error);
					reject({ stat: false, message: "Error in Authentication" });
				});
		} catch (error) {
			console.log("Error in login::", error);
			reject({ stat: false, message: "Error in Authentication" });
		}
	});
}

function logoutService(req, res) {
	try {
		res.clearCookie("authToken");
	} catch (error) {
		console.log(error);
	}
}
