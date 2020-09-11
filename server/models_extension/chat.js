const models = require("../models");
const sequelize = require("sequelize");
const userExtension = require("./userExtension");
const _ = require("lodash");

module.exports = {
  async saveMessage(data) {
    var originalMessage = null;
    var receiverMessage = null;
    var receiver = null;
    var channel = null;
    try {
      var userId = userExtension.jwtGetPayload(data.jwt);
      channel = await models.Channel.findOne({
        where: { uuId: data.message.channelUuId },
      });
      if (channel) {
        if (userId != undefined) {
          var channelMembers = await models.ChannelMember.findAll({
            where: {
              channelId: channel.id,
            },
          });
          if (
            channelMembers == null ||
            _.findIndex(channelMembers, (m) => m.userId == userId) == -1
          )
            return;

          originalMessage = await models.Message.create({
            channelId: channel.id,
            userId: userId,
            content: data.message.content,
            seen: true,
            isEmojiMessage: data.message.isEmojiMessage,
          });

          receiver = _.find(channelMembers, (m) => m.userId != userId);
          if (receiver != null && originalMessage != null) {
            receiverMessage = await models.Message.create({
              channelId: channel.id,
              userId: userId,
              content: data.message.content,
              originalId: originalMessage.id,
              receiverId: receiver.userId,
              seen: false,
              isEmojiMessage: originalMessage.isEmojiMessage,
            });
          }
        }
      }
    } catch (err) {
      console.log("Error happend " + err);
    }

    return {
      originalMessage: {
        createdAt: originalMessage.createdAt,
        uuId: originalMessage.uuId,
      },
      receiverMessage: {
        uuId: receiverMessage.uuId,
        content: receiverMessage.content,
        createdAt: receiverMessage.createdAt,
        seen: false,
        isEmojiMessage: receiverMessage.isEmojiMessage,
        isMine: false,
      },
      tmpId: data.tmpId,
      receiverId: receiver.userId,
      channelId: channel.id,
    };
  },
};
