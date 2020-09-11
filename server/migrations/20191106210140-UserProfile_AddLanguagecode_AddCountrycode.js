"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn("UserProfiles", "languageCode", {
          type: Sequelize.STRING,
          allowNull: false
        }),
        queryInterface.addColumn("UserProfiles", "countryCode", {
          type: Sequelize.STRING,
          allowNull: false
        })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("UserProfiles", "languageCode"),
        queryInterface.removeColumn("UserProfiles", "countryCode")
      ]);
    });
  }
};
