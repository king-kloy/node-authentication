const User = require("../models/User.model");

module.exports = {
  signUp: async (req, res, next) => {
    const {
      email,
      password
    } = req.value.body;

    // check with email if user already exist
    const foundUser = await User.findOne();
    if (foundUser) {
      return res.status(403).json({
        message: "email already in use"
      });
    }

    // create a new user
    const newUser = new User({
      email,
      password
    });

    // save the user to the database
    await newUser.save();

    // response with token
    return res.json({
      message: "new user created successfully"
    });
  },
  signIn: async (req, res, next) => {
    console.log("UserController.signIn() is called");
  },
  secret: async (req, res, next) => {
    console.log("UserController.secret() is called");
  },
}