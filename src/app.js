console.log('runnng app.js - configuring express server');
const express = require("express");
const bodyParser = require("body-parser");
//const morgan = require("morgan");
const routes = require("./routes/routes.js");
// require("./sfgroup_db.js");
// require("./gbarco_db.js");

const server = express();
server.name = "server";
//const callisto = express();
//server.name = "callisto";

//==============MIDDLEWARES=========================

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(express.json());
server.use(cors()); // Allow all origins
//server.use(morgan("dev"));
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Request-Method", "*");
    res.header(
        "Access-Control-Allow-Headers", "*"
        // "origin, x-requested-with, content-type, accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    next();
});
server.use("/", routes);
server.use((err, req, res, next) => {
    // Error catching endware.
    // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    console.error('Algo salio mal!');
    console.error(err);
    res.status(status).send(message);
});


module.exports = server;