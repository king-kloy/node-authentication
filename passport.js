const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const {
  ExtractJwt
} = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv/config");

const User = require("./models/User.model");

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    // find the user with specified token
    const user = await User.findById(payload.sub);

    // if user doesn't exist, handle it
    if (!user) {
      return done(null, false);
    }

    // otherwise, return the user
    return done(null, user);
  } catch (error) {
    done(null, error);
  }
}));

//Local Strategy
passport.use(new LocalStrategy({
  usernameField: "email"
}, async (email, password, done) => {
  try {
    // find the user with the given email
    const user = await User.findOne({
      email
    });

    // if not user, handle it
    if (!user) {
      return done(null, false);
    }

    // check if password is correct
    const isMatchPassword = await user.isValidPassword(password);

    // if not, handle it
    if (!isMatchPassword) {
      return done(null, false);
    }

    // otherwise return the user

    return done(null, user);

  } catch (error) {
    done(error, false);
  }
}));