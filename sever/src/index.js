const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const docenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;
const route = require("./route");



const http = require("http");

const server = http.createServer(app);


app.use(cors({
    origin: process.env.ORIGIN_CORS,
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
    });

// connect to database
const db = require("./db");
db.connect();

// app routes
route(app);

// app listening on port
server.listen(PORT, () => {
  console.log(`Sever listen http://localhost:${PORT}`);
});
