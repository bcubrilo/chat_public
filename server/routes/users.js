var express = require("express");
var router = express.Router();
var authController = require("../controllers/authenticationController");
var UsersController = require("../controllers/UsersController");

var authPolicy = require("../policies/AuthPolicy");
var authContrlPolicy = require("../policies/AuthenticationControllerPolicy");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/register", authContrlPolicy, authController.register);
router.post("/login", authController.login);
router.get("/logout", authPolicy);

module.exports = router;
