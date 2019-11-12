const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/APIAuthentication", {
  useNewUrlParser: true
}); // connect to mongo URI

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());

// routes
app.use("/users", require("./routes/user"));

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});