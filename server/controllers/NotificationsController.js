const notificationExtension = require("../models_extension/notificationExtension");
const models = require("./../models");
module.exports = {
  async getPrevious(req, res) {
    var nots = await notificationExtension.getPrevious(
      req.user.id,
      req.params.date
    );
    res.status(200).send({ notifications: nots });
  },
  async getUnread(req, res) {
    var nots = await notificationExtension.getUnread(req.user.id);
    res.status(200).send({ notifications: nots });
  },
  async setSeen(req, res) {
    await notificationExtension.setSeen(req.user.id);
    res.status(200).send({ message: "OK" });
  },
  async delete(req, res) {
    await models.Notification.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });
    res.status(200).send({ message: "OK" });
  },
};
