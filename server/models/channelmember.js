"use strict";
module.exports = (sequelize, DataTypes) => {
  const ChannelMember = sequelize.define(
    "ChannelMember",
    {
      channelId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT
    },
    {}
  );
  ChannelMember.associate = function(models) {
    ChannelMember.belongsTo(models.User, { foreignKey: "userId", as: "user" }),
      ChannelMember.belongsTo(models.Channel, {
        foreignKey: "channelId",
        as: "channel"
      });
  };
  return ChannelMember;
};
