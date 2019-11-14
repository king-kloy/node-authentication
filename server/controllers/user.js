const jwt = require("jsonwebtoken");
require("dotenv/config");

const User = require("../models/User.model");

// generate sign token
const signToken = user => {
  return jwt.sign({
    iss: 'king-kloy',
    sub: user._id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // expires in 1 day
  }, process.env.JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    const {
      email,
      password
    } = req.value.body;

    // check with email if user already exist
    const foundUser = await User.findOne({
      "local.email": email
    });
    if (foundUser) {
      return res.status(403).json({
        error: "email already in use"
      });
    }

    // create a new user
    const newUser = new User({
      method: "local",
      local: {
        email,
        password
      }
    });

    // save the user to the database
    await newUser.save();

    // create token
    const token = signToken(newUser);

    // response with token
    return res.status(200).json({
      token
    });
  },
  signIn: async (req, res, next) => {
    // generate token by the req.user
    const token = signToken(req.user);
    res.status(200).json({
      token
    });
    console.log("UserController.signIn() is called");
  },
  googleOAuth: async (req, res, next) => {
    // generate token by the req.user
    const token = signToken(req.user);
    res.status(200).json({
      token
    });
    console.log("UserController.signIn() is called");
  },
  secret: async (req, res, next) => {
    console.log("UserController.secret() is called");
    res.json({
      secret: "resource"
    });
  },
}