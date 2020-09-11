"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("ProfileLikes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.BIGINT
        },
        likedUserId: {
          type: Sequelize.BIGINT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() => {
        queryInterface.addConstraint("ProfileLikes", ["userId"], {
          type: "foreign key",
          name: "fk_profile_likes_userId",
          references: {
            table: "Users",
            field: "id"
          },
          onDelete: "cascade",
          onUpdate: "cascade"
        });
        queryInterface.addConstraint("ProfileLikes", ["likedUserId"], {
          type: "foreign key",
          name: "fk_profile_likes_likedUserId",
          references: {
            table: "Users",
            field: "id"
          }
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ProfileLikes");
  }
};
