const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create user schema
const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
});

// create user model
const User = mongoose.model("User", userSchema);

// export model
module.exports = User;