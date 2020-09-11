const { ProfileLikes, User, UserProfile } = require("../models");
const userExension = require("../models_extension/userExtension");
const notficationExension = require("../models_extension/notificationExtension");
const _ = require("lodash");
module.exports = function (param) {
  var controller = {};
  (controller.index = async function (req, res) {
    try {
      var likes = await ProfileLikes.findAll({
        where: {
          userId: req.user.id,
        },
        attributes: ["id"],
        include: [
          {
            model: User,
            as: "likedUser",
            attributes: ["name", "username"],
            include: [
              {
                model: UserProfile,
                as: "profile",
                attributes: ["profileImageUrl"],
              },
            ],
          },
        ],
      });
      res.status(200).send({ likes: likes, message: "OK" });
    } catch (err) {
      res.status(500).send({ likes: null, message: "OK" });
    }
  }),
    (controller.allLikes = async function (req, res) {
      try {
        var likes = await ProfileLikes.findAll({
          where: {
            likedUserId: req.user.id,
          },
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "username"],
              include: [
                {
                  model: UserProfile,
                  as: "profile",
                  attributes: ["profileImageUrl"],
                },
              ],
            },
          ],
        });
        res.status(200).send({
          likes: likes,
          message: "OK",
        });
      } catch (err) {
        res.status(500).send({
          likes: null,
          message: "Error",
        });
      }
    }),
    (controller.create = async function (req, res) {
      try {
        const { likedUsername } = req.body;
        var user = await userExension.findUserByUsername(req.body.username);
        var like = await ProfileLikes.findOrCreate({
          where: {
            userId: req.user.id,
            likedUserId: user.id,
          },
        });
        var likeExt = null;
        if (like) {
          likeExt = await ProfileLikes.findOne({
            where: {
              userId: req.user.id,
              likedUserId: user.id,
            },
            attributes: ["id"],
            include: [
              {
                model: User,
                as: "likedUser",
                attributes: ["name", "username"],
                include: [
                  {
                    model: UserProfile,
                    as: "profile",
                    attributes: ["profileImageUrl"],
                  },
                ],
              },
            ],
          });
        }

        res.status(200).send({
          like: likeExt,
          message: "OK",
        });
        var notification = await notficationExension.create(
          req.user.id,
          user.id,
          "notification-profile-like",
          JSON.stringify({
            name: "user-profile",
            params: { username: req.user.username },
          })
        );
        var sockets = param.socketManager.getSockets(user.id);
        if (sockets && sockets.length > 0) {
          _.forEach(sockets, (socket) => {
            socket.emit("notification", notification);
          });
        }
      } catch (err) {
        res.status(500).send({ like: null, message: "Error" });
      }
    }),
    (controller.delete = async function (req, res) {
      try {
        var user = await userExension.findUserByUsername(req.params.username);
        if (user) {
          await ProfileLikes.destroy({
            where: {
              userId: req.user.id,
              likedUserId: user.id,
            },
          });
          res.status(200).send({ message: "OK" });
        }
      } catch (err) {
        res.status(500).send({ message: "Error" });
      }
    });
  return controller;
};
