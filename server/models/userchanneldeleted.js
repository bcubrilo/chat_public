"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserChannelDeleted = sequelize.define(
    "UserChannelDeleted",
    {
      userId: DataTypes.BIGINT,
      channelId: DataTypes.BIGINT
    },
    {}
  );
  UserChannelDeleted.associate = function(models) {
    // associations can be defined here
  };
  return UserChannelDeleted;
};
