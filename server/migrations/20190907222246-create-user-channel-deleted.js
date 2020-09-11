"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "UserChannelDeleteds",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
        },
        channelId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: "Channels",
            key: "id",
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          channel_deleted_unique: {
            fields: ["userId", "channelId"],
          },
        },
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UserChannelDeleteds");
  },
};
