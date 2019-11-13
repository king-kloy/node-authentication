const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
// connect to mongo URI
if (process.env.NODE_ENV === "test") {
  mongoose.connect("mongodb://localhost/APIAuthenticationTEST", {
    useNewUrlParser: true,
    useMongoClient: true
  });
} else {
  mongoose.connect("mongodb://localhost/APIAuthentication", {
    useNewUrlParser: true,
    useMongoClient: true
  });
}
 

const app = express();

// middlewares moved morgan into if clear tests
if (!process.env.NODE_ENV === "test") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());

// routes
app.use("/users", require("./routes/user"));

module.exports = app;
