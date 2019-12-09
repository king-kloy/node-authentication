const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const {
  ExtractJwt
} = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv/config");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
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

// Google OAuth Strategy
passport.use("googleToken", new GooglePlusTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("profile", profile);

    // check if user exist in our db
    const existingUser = await User.findOne({
      "google.id": profile.id
    });
    if (existingUser) {
      return done(null, existingUser);
    }

    // if new account
    const newUser = new User({
      method: "google",
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });
    // save new user
    await newUser.save();
    done(null, newUser);

  } catch (error) {
    done(error, false, error.message);
  }
}));

// Facebook OAuth Strategy
passport.use("facebookToken", new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("profile", profile);

    // check if user exist in our db
    const existingUser = await User.findOne({
      "facebook.id": profile.id
    });
    if (existingUser) {
      return done(null, existingUser);
    }

    // if new account
    const newUser = new User({
      method: "facebook",
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });
    // save new user 
    await newUser.save();
    done(null, newUser);

  } catch (error) {
    done(error, false, error.message);
  }
}));

//Local Strategy
passport.use(new LocalStrategy({
  usernameField: "email"
}, async (email, password, done) => {
  try {
    // find the user with the given email
    const user = await User.findOne({
      "local.email": email
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