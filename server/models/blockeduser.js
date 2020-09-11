"use strict";
module.exports = (sequelize, DataTypes) => {
  const BlockedUser = sequelize.define(
    "BlockedUser",
    {
      userId: DataTypes.BIGINT,
      blockedUserId: DataTypes.BIGINT
    },
    {}
  );
  BlockedUser.associate = function(models) {
    BlockedUser.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user"
    });
    BlockedUser.belongsTo(models.User, {
      foreignKey: "blockedUserId",
      as: "blockedUserInfo"
    });
  };
  return BlockedUser;
};
