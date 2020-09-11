const models = require("../models");
const sequelize = require("sequelize");
module.exports = {
  async getUnread(userId) {
    var res = await models.Notification.findAll({
      where: {
        notifiedUserId: userId,
        seen: 0,
      },
      attributes: ["id", "content", "createdAt", "url"],
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name", "username"],
          include: [
            {
              model: models.UserProfile,
              as: "profile",
              attributes: ["profileImageUrl"],
            },
          ],
        },
      ],
    });
    return res;
  },
  async getPrevious(userId, date) {
    var res = await models.Notification.findAll({
      where: {
        notifiedUserId: userId,
        updatedAt: {
          [sequelize.Op.lt]: date,
        },
      },
      attributes: ["id", "content", "createdAt", "url", "seen"],
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name", "username"],
          include: [
            {
              model: models.UserProfile,
              as: "profile",
              attributes: ["profileImageUrl"],
            },
          ],
        },
      ],
    });
    return res;
  },
  async setSeen(userId) {
    await models.Notification.update(
      { seen: true },
      {
        where: {
          notifiedUserId: userId,
          seen: 0,
        },
      }
    );
  },
  async getByID(id) {
    var res = await models.Notification.findAll({
      where: {
        id: id,
      },
      attributes: ["id", "content", "createdAt", "url"],
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name", "username"],
          include: [
            {
              model: models.UserProfile,
              as: "profile",
              attributes: ["profileImageUrl"],
            },
          ],
        },
      ],
    });
    return res;
  },
  async create(userId, notifiedUserId, content, url) {
    try {
      var notification = await models.Notification.create({
        userId: userId,
        notifiedUserId: notifiedUserId,
        content: content,
        url: url,
        seen: false,
      });
      var notfExtended = await this.getByID(notification.id);
      return notfExtended;
    } catch (error) {
      console.log(error);
    }
    return null;
  },
};
