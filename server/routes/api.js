var express = require("express");
var passport = require("passport");
var multer = require("multer");
var router = express.Router();

module.exports = function (param) {
  var UsersController = require("../controllers/UsersController");
  var ChatsController = require("../controllers/ChatsController")(param);
  var BlockedUsersController = require("../controllers/BlockedUsersController");
  var ProfileLikesController = require("../controllers/ProfileLikesController")(
    param
  );
  var PostsController = require("../controllers/PostsController")(param);
  var NotificationsController = require("../controllers/NotificationsController");

  var authPolicy = require("../policies/AuthPolicy");

  var fileUpload = multer({ dest: "./public/uploads" }).single("file");

  router.get("/users", authPolicy, UsersController.index);
  router.get(
    "/users/most-recent",
    authPolicy,
    UsersController.getMostRecentUsers
  );
  router.get(
    "/users/public-profile/:username",
    authPolicy,
    UsersController.getPublicProfile
  );
  router.get(
    "/users/search/:keywords/:countryCode?/:skip?",
    authPolicy,
    UsersController.search
  );

  router.get(
    "/users/verify-email/:username/:code",
    UsersController.verifyEmail
  );
  router.get(
    "/users/recomended-users",
    authPolicy,
    UsersController.recomendedUsers
  );

  router.post("/profile", authPolicy, UsersController.saveProfile);
  router.get(
    "/profile/user-profile/:userId",
    authPolicy,
    UsersController.getProfile
  );
  router.post("/profile/update", authPolicy, UsersController.updateProfile);
  router.post(
    "/profile/upload-profile-image",
    [authPolicy, fileUpload],
    UsersController.uploadProfileImage
  );
  router.get(
    "/profile/delete-profile-image",
    authPolicy,
    UsersController.deleteProfileImage
  );
  router.post("/profile/update-user", authPolicy, UsersController.updateUser);

  router.post(
    "/chat/create-channel",
    authPolicy,
    ChatsController.createChannel
  );
  router.post(
    "/chat/delete-channel",
    authPolicy,
    ChatsController.deleteChannel
  );
  router.post("/chat/save-message", authPolicy, ChatsController.saveMessage);
  router.post(
    "/chat/delete-message",
    authPolicy,
    ChatsController.deleteMessage
  );
  router.get("/chat/channels", authPolicy, ChatsController.channels);
  router.post(
    "/chat/channel-messages",
    authPolicy,
    ChatsController.getChannelMessages
  );

  router.post(
    "/chat/set-messages-seen",
    authPolicy,
    ChatsController.setMessagesSeen
  );
  router.delete(
    "/chat/delete-channel/",
    authPolicy,
    ChatsController.setChannelDeleted
  );

  router.get("/blocked-users", authPolicy, BlockedUsersController.index);
  router.post("/blocked-users", authPolicy, BlockedUsersController.create);
  router.delete(
    "/blocked-users/:username",
    authPolicy,
    BlockedUsersController.delete
  );
  router.get("/profile-likes", authPolicy, ProfileLikesController.index);
  router.get(
    "/profile-likes/all-likes",
    authPolicy,
    ProfileLikesController.allLikes
  );
  router.post("/profile-likes", authPolicy, ProfileLikesController.create);
  router.delete(
    "/profile-likes/:username",
    authPolicy,
    ProfileLikesController.delete
  );
  router.post("/change-password", authPolicy, UsersController.changePassword);

  router.post("/post", authPolicy, PostsController.create);

  router.delete("/post/:postId", authPolicy, PostsController.delete);
  router.put("/post", authPolicy, PostsController.update);
  router.get(
    "/post/user/:username",
    authPolicy,
    PostsController.getPostsTreesByUserID
  );
  router.post("/post/recent", authPolicy, PostsController.getRecentPosts);
  router.get("/post/:postId", authPolicy, PostsController.index);
  router.get("/post/comments/:postId", authPolicy, PostsController.getComments);
  router.get(
    "/post/search/:keywords/:dateFrom?/:dateTo?",
    authPolicy,
    PostsController.search
  );

  router.get(
    "/notifications/unread",
    authPolicy,
    NotificationsController.getUnread
  );
  router.get(
    "/notifications/set-seen",
    authPolicy,
    NotificationsController.setSeen
  );
  router.get(
    "/notifications/previous/:date",
    authPolicy,
    NotificationsController.getPrevious
  );
  router.delete(
    "/notifications/:id",
    authPolicy,
    NotificationsController.delete
  );

  return router;
};
