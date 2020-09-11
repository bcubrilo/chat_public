"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Users",
        "emailVerified",
        {
          allowNull: true,
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        "Users"
      ),
      queryInterface.addColumn(
        "Users",
        "emailVerificationCode",
        {
          allowNull: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        "Users"
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Users", "emailVerified"),
        queryInterface.removeColumn("Users", "emailVerificationCode"),
      ]);
    });
  },
};
