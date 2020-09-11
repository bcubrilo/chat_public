'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserMessageDeleted = sequelize.define('UserMessageDeleted', {
    userId: DataTypes.BIGINT,
    messageId: DataTypes.BIGINT
  }, {});
  UserMessageDeleted.associate = function(models) {
    // associations can be defined here
  };
  return UserMessageDeleted;
};