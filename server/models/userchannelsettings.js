"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserChannelSettings = sequelize.define(
    "UserChannelSettings",
    {
      channelId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT,
      lastReadMessageId: DataTypes.BIGINT,
      showNotificatiosn: DataTypes.BOOLEAN
    },
    {}
  );
  UserChannelSettings.associate = function(models) {
    // associations can be defined here
  };
  return UserChannelSettings;
};
