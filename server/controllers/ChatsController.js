const models = require("../models");
const sequelize = require("sequelize");
const userExension = require("../models_extension/userExtension");
const channelExtension = require("../models_extension/channelExtension");
const _ = require("lodash");
const uuid = require("uuid");

module.exports = function (param) {
  var controller = {};
  (controller.index = async function (req, res) {}),
    (controller.createChannel = async function (req, res) {
      let peer = await userExension.findUserByUsername(req.body.username);
      const existingChannel = await channelExtension.findChannelForUsers(
        req.user.id,
        peer.id
      );
      if (existingChannel == null) {
        var channel = await models.Channel.create();
        models.sequelize
          .transaction(async (t) => {
            return await models.ChannelMember.create(
              {
                channelId: channel.id,
                userId: req.user.id,
              },
              { transaction: t }
            ).then(async (member1) => {
              if (member1) {
                await models.ChannelMember.create({
                  channelId: channel.id,
                  userId: peer.id,
                });
              }
            });
          })
          .then(async (result) => {
            let channelExtended = await channelExtension.findChanelsExtendedByIds(
              [channel.id]
            );
            param.socketManager.joinChannel(req.user.id, channel.id);
            param.socketManager.joinChannel(peer.id, channel.id);
            res.status(200).send({
              data:
                channelExtended != null && channelExtended.length > 0
                  ? channelExtended[0]
                  : null,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Error happend while creating channel." + error,
            });
          });
      } else {
        var channel = await models.Channel.findOne({
          where: { uuId: existingChannel.uuId },
        });
        try {
          if (channel) {
            await models.UserChannelDeleted.destroy({
              where: {
                channelId: channel.id,
                userId: req.user.id,
              },
            });
          }
        } catch (ex) {
          console.log(ex);
        }

        let channelExtended = await channelExtension.findChanelsExtendedByIds([
          channel.id,
        ]);
        res.status(200).send({ data: channelExtended[0] });
      }
    }),
    (controller.setChannelDeleted = async function (req, res) {
      try {
        var channel = await models.Channel.findOne({
          where: {
            uuid: req.body.uuId,
          },
        });
        if (channel) {
          var entry = await models.UserChannelDeleted.create({
            userId: req.user.id,
            channelId: channel.id,
          });
          if (entry) {
            await models.Message.destroy({
              where: {
                channelId: channel.id,
                [sequelize.Op.or]: [
                  { receiverId: req.user.id },
                  { userId: req.user.id },
                ],
              },
            });
            res.status(200).send({ message: "OK" });
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
      res.status(500).send({ message: "Error!" });
    }),
    (controller.deleteChannel = async function (req, res) {
      try {
        var channel = await models.Channel.findOne({
          where: {
            id: req.body.id,
          },
        });
        if (channel != null) {
          if (channel.hasUser(req.user.id)) {
            await models.ChannelMember.destroy({
              where: {
                channelId: req.body.id,
              },
            });
            await models.Message.destroy({
              where: {
                channelId: req.body.id,
              },
            });
            await models.Channel.destroy({
              where: {
                id: req.body.id,
              },
            });
          }
        }
        res.status(200).send({ message: "OK" });
      } catch (error) {
        res.status(500).send({ message: "Error." });
      }
    }),
    (controller.deleteMessage = async function (req, res) {
      try {
        models.Message.destroy({
          where: {
            id: req.body.id,
            userId: req.user.id,
          },
        });
        res.status(200).send({ message: "Message is deleted." });
      } catch (err) {
        res.status(500).send({ message: "Message is not deleted." });
      }
    }),
    (controller.getMessages = async function (req, res) {}),
    (controller.saveMessage = async function (req, res) {
      try {
        let message = null;
        let userId = req.user.id;
        if (req.body.id > 0) {
          message = await models.Message.findOne({
            where: {
              id: req.body.id,
              userId: userId,
            },
          });
          if (message != null) {
            message.content = req.body.content;
            message.save();
          }
        } else {
          let channel = await models.Channel.findOne({
            where: {
              id: req.body.channelId,
            },
            include: [
              {
                model: models.ChannelMember,
                as: "members",
                where: { userId: userId },
              },
            ],
          });
          if (channel != null) {
            message = await models.Message.create({
              channelId: req.body.channelId,
              userId: userId,
              content: req.body.content,
            });
          }
        }
        if (message != null) {
          _.each(param.io.sockets.in(message.channelId), (socket) => {
            socket.to(message.channelId).emit("new_message", message);
          });
          // param.io.sockets// .to(JSON.stringify(message.channelId)) //.in(message.channelId)
          // .broadcast
          //   .to(message.channelId)
          //   .emit("new_message", message);
          res
            .status(200)
            .send({ message: "Message is saved.", messageId: message.id });
        } else {
          res
            .status(500)
            .send({ messge: "Error happend, message is not saved." });
        }
      } catch (err) {
        res.status(500).send({ message: "Error happend." + err });
      }
    }),
    (controller.channels = async function (req, res) {
      let channels = await channelExtension.findChannelsByUserId(req.user.id);
      res.status(200).send({ channels: channels });
    });
  controller.getChannelMessages = async function (req, res) {
    var messages = await channelExtension.getChannelMessages(
      req.user.id,
      req.body.channelUuId,
      req.body.lastMessageTime
    );
    res.status(200).send({
      messages: messages,
      channelUuId: req.body.channelUuId,
    });
  };
  controller.setMessagesSeen = async function (req, res) {
    await models.Message.update(
      {
        seen: true,
      },
      {
        where: {
          uuId: { [sequelize.Op.in]: req.body.messageIds },
          receiverId: req.user.id,
        },
      }
    );
    res.status(200).send({ message: "OK" });
  };
  return controller;
};
