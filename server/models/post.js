"use strict";
const uuid = require("uuid");
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      userId: DataTypes.BIGINT,
      content: DataTypes.TEXT,
      parentPostId: DataTypes.UUID,
    },
    {
      hooks: {
        beforeSave: async (post, options) => {
          post.id = uuid.v4();
        },
      },
    }
  );
  Post.associate = function (models) {
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Post.hasMany(models.Message, {
      key: "parentPostId",
      as: "childPosts",
      onDelete: "cascade",
      hooks: true,
    });
  };
  return Post;
};
