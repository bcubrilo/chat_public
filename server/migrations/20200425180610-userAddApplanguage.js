"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Users",
        "appLanguageCode",
        {
          allowNull: false,
          type: Sequelize.STRING(3),
          defaultValue: "en",
        },
        "Users"
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Users", "appLanguageCode"),
      ]);
    });
  },
};
