const express = require("express");
const router = require("express-promise-router")();

// user controller
const UsersController = require("../controllers/user");

router.post("/signup", UsersController.signUp);

router.post("/signin", UsersController.signIn);

router.get("/secret", UsersController.secret);

module.exports = router;