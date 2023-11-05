const authService = require("../services/authService");

const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
	authService
		.registrationService(req, res)
		.then((result) => res.json(result))
		.catch((err) => res.status(400).json(err));
});

router.post("/login", (req, res) => {
	authService
		.loginService(req, res)
		.then((result) => res.json(result))
		.catch((err) => res.status(400).json(err));
});

router.post("/logout", (req, res) => {
	authService.logoutService(req, res);
	res.json({ message: "Logged out successfully" });
});

module.exports = router;
