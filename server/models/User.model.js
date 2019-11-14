const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create user schema
const userSchema = Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: String,
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: String,
    email: {
      type: String,
      lowercase: true
    }
  }
});

// generate hashed password before save
userSchema.pre("save", async function (next) {
  try {
    // handle it if it's google or facebook oauth
    if (this.method !== "local") {
      next();
    }

    // generate salt
    const salt = await bcrypt.genSalt(10);
    // generate a password hash -> [ salt + hash ]
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    // re-assigned hashed password over original plain text password
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

// checks if password is valid
userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
}


// create user model
const User = mongoose.model("User", userSchema);

// export model
module.exports = User;