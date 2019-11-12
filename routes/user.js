const express = require("express");
const router = require("express-promise-router")();

const {
  validateBody,
  schemas
} = require("../helpers/routeHelpers");
const UsersController = require("../controllers/user");

router.post("/signup", validateBody(schemas.authSchema), UsersController.signUp);

router.post("/signin", UsersController.signIn);

router.get("/secret", UsersController.secret);

module.exports = router;