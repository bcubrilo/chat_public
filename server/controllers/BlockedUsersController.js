const { BlockedUser, User } = require("../models");
const userExension = require("../models_extension/userExtension");
module.exports = {
  async index(req, res) {
    try {
      var blockedUsers = await BlockedUser.findAll({
        where: {
          userId: req.user.id
        },
        attributes: ["id"],
        include: [
          {
            model: User,
            as: "blockedUserInfo",
            attributes: ["name", "username"]
          }
        ]
      });
      res.status(200).send({
        blockedUsers: blockedUsers,
        message: "OK"
      });
    } catch (err) {
      res.status(500).send({ blockedUsers: null, message: "Error" });
    }
  },
  async create(req, res) {
    const { blockedUserId } = req.body;
    var user = await userExension.findUserByUsername(req.body.username);
    try {
      BlockedUser.findOrCreate({
        where: {
          userId: req.user.id,
          blockedUserId: user.id
        }
      }).spread((blockedUser, created) => {
        res.status(200).send({
          blockedUser: { id: blockedUser.id },
          message: "OK"
        });
      });
    } catch (err) {
      res.status(500).send({ message: "Error happend" });
    }
  },
  async delete(req, res) {
    try {
      var user = await userExension.findUserByUsername(req.body.username);
      await BlockedUser.destroy({
        where: {
          userId: req.user.id,
          blockedUserId: user.id
        }
      });
      res.status(200).send({ status: true, message: "OK" });
    } catch (err) {
      res.status(500).send({ status: false, message: "Error" });
    }
  }
};
