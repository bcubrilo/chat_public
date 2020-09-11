"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("UserChannelSettings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      channelId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Channels",
          key: "id"
        },
        allowNull: false
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "id"
        },
        allowNull: false
      },
      lastReadMessageId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Messages",
          key: "id"
        }
      },
      showNotifications: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UserChannelSettings");
  }
};
