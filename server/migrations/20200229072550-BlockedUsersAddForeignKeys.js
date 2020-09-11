"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint("BlockedUsers", ["userId"], {
        type: "foreign key",
        name: "fk_blocked_users_userId",
        references: {
          table: "Users",
          field: "id"
        }
      }),
      queryInterface.addConstraint("BlockedUsers", ["blockedUserId"], {
        type: "foreign key",
        name: "fk_blocked_users_blockedUserId",
        references: {
          table: "Users",
          field: "id"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.equelize.transaction(t => {
      return Promise.all([
        queryInterface.removeConstraint(
          "BlockedUsers",
          "fk_blocked_users_userId"
        ),
        queryInterface.removeConstraint(
          "BlockedUsers",
          "fk_blocked_users_blockedUserId"
        )
      ]);
    });
  }
};
