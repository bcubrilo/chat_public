const { User } = require("../models");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/appconfig");
const userExt = require("../models_extension/userExtension");
const sequelize = require("sequelize");
const emailSender = require("./../utils/emailSender");

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24;
  return jwt.sign(user.id, appConfig.authentication.jwtSecret);
}

module.exports = {
  async register(req, res) {
    try {
      var existingUser = null;
      var message = "";
      if (req.body.username) {
        var existingUser = await userExt.findUserByUsername(req.body.username);
        message = "Username is taken.";
      }

      if (!existingUser) {
        if (req.body.email) {
          existingUser = await userExt.findUserByEmail(req.body.email);
          message = "Use another email.";
        }
      }
      if (existingUser) {
        res.status(400).send({
          error: message,
        });
      } else {
        const user = await User.create(req.body);
        const userJson = user.toJSON();
        await emailSender.sendEmailConfirmationLink(user, true);
        res.send({
          user: userJson,
          token: jwtSignUser(user),
        });
      }
    } catch (err) {
      res.status(400).send({
        error: "Error while registering user" + err,
      });
    }
  },
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({
        where: {
          [sequelize.Op.or]: [{ email: username }, { username: username }],
        },
      });
      if (!user || (user.email === username && !user.emailVerified)) {
        return res.status(403).send({
          error: "Incorect credentials",
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(403).send({
          error: "The login information was incorrect",
        });
      }
      console.log("Found user " + user.name);
      res.send({
        data: {
          user: user.toJSON(),
          token: jwtSignUser(user),
        },
      });
    } catch (err) {
      console.log(err);
      res.status(404).send({ error: "Error happend." + err });
    }
  },
};
