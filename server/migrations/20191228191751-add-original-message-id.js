"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Messages",
        "originalId",
        {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        "Messages"
      ),
      queryInterface.addConstraint("Messages", ["originalId"], {
        type: "foreign key",
        name: "fk_messages_originalId",
        references: {
          table: "Messages",
          field: "id"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Messages", "originalId")
      ]);
    });
  }
};
