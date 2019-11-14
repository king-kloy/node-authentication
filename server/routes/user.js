const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");

const passportConfig = require("../passport");

const passportSignIn = passport.authenticate("local", {
  session: false
});
const passportJWT = passport.authenticate("jwt", {
  session: false
});
const passportGoogle = passport.authenticate("googleToken", {
  session: false
});


const {
  validateBody,
  schemas
} = require("../helpers/routeHelpers");
const UsersController = require("../controllers/user");

router.post("/signup", validateBody(schemas.authSchema), UsersController.signUp);

router.post("/oauth/google", passportGoogle, UsersController.googleOAuth);

router.post("/signin", validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);

router.get("/secret", passportJWT, UsersController.secret);

module.exports = router;