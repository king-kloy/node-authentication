const bcrypt = require("bcryptjs");
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

// generate hashed password before save
userSchema.pre("save", async function (next) {
  try {
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // generate a password hash -> [ salt + hash ]
    const passwordHash = await bcrypt.hash(this.password, salt);
    // re-assigned hashed password over original plain text password
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

// checks if password is valid
userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
}


// create user model
const User = mongoose.model("User", userSchema);

// export model
module.exports = User;