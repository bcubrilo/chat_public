const myModels = require("../models");
const uuid = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define(
    "Channel",
    {
      uuId: DataTypes.UUID,
    },
    {
      hooks: {
        beforeSave: async (channel, options) => {
          channel.uuId = uuid.v4();
        },
      },
    }
  );
  Channel.associate = function (models) {
    Channel.hasMany(models.ChannelMember, {
      key: "channelId",
      as: "members",
      onDelete: "cascade",
      hooks: true,
    }),
      Channel.hasMany(models.Message, {
        key: "channelId",
        as: "messages",
        onDelete: "cascade",
        hooks: true,
      });
  };

  Channel.prototype.hasUser = async function (userId) {
    var member = this.members.find((m) => m.userId == userId);
    return member != null;
  };

  return Channel;
};
