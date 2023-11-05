const express = require("express");

const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

const users = require("../routes/users");
const transactionType = require("../routes/transactionType");
const transactionCategory = require("../routes/transactionCategory");
const transaction = require("../routes/transaction");
const auth = require("../routes/auth");

module.exports = function (app) {
	app.use(express.json());
	app.use(cookieParser());
	app.use("/api/users", users);
	app.use("/api/transactionType", transactionType);
	app.use("/api/transactionCategory", transactionCategory);
	app.use("/api/transaction", transaction);
	app.use("/api/auth", auth);
};
