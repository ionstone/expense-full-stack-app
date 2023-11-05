const express = require("express");
var cors = require("cors");

const app = express();

app.use(
	cors({
		origin: "http://localhost:4200", 
		credentials: true,
	})
);

require("./startup/routes")(app);
require("./startup/config")();

const port = 7000;

const server = app.listen(port);

module.exports = server;
