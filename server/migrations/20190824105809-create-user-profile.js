"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("UserProfiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "id"
        }
      },
      profileImageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      languageId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING(1),
        allowNull: false
      },
      interestedInGender: {
        type: Sequelize.STRING(1),
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UserProfiles");
  }
};
