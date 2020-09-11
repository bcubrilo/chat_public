"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      notifiedUserId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      seen: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Notifications");
  },
};
