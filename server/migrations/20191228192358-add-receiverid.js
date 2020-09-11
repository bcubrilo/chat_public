"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Messages",
        "receiverId",
        {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        "Messages"
      ),
      queryInterface.addConstraint("Messages", ["receiverId"], {
        type: "foreign key",
        name: "fk_messages_receiverId",
        references: {
          table: "Users",
          field: "id"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("Messages", "receiverId")
      ]);
    });
  }
};
