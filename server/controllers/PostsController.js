const models = require("./../models");
const postExtension = require("./../models_extension/postExtension");
const notficationExension = require("../models_extension/notificationExtension");
const _ = require("lodash");
module.exports = function (param) {
  const controller = {};
  (controller.index = async function (req, res) {
    var post = await postExtension.getPostWithComments(req.params.postId);
    res.status(200).send({ message: "OK", post: post });
  }),
    (controller.create = async function (req, res) {
      var postExtended = null;
      try {
        var post = await models.Post.create({
          userId: req.user.id,
          content: req.body.content,
          parentPostId: req.body.parentPostId || null,
        });
        postExtended = await postExtension.getPostExtendedById(post.id);
      } catch (err) {
        console.log("error happened");
      }
      res
        .status(postExtended ? 200 : 500)
        .send({ message: postExtended ? "OK" : "Error", post: postExtended });
      if (req.body.parentPostId) {
        var post = await models.Post.findOne({
          where: {
            id: req.body.parentPostId,
          },
          attributes: ["userId"],
        });
        if (post && post.userId !== req.user.id)
          var notification = await notficationExension.create(
            req.user.id,
            post.userId,
            "notification-post-comment",
            JSON.stringify({
              name: "post",
              params: { postId: req.body.parentPostId },
            })
          );
        var sockets = param.socketManager.getSockets(post.userId);
        if (sockets && sockets.length > 0) {
          _.forEach(sockets, (socket) => {
            socket.emit("notification", notification);
          });
        }
      }
    }),
    (controller.update = async function (req, res) {
      var status = false;
      try {
        var post = await models.Post.findOne({
          where: {
            userId: req.user.id,
            id: req.body.postId,
          },
        });
        if (post) {
          post.content = req.body.content;
          post.save();
        }
        status = true;
      } catch (error) {}
      res
        .status(status ? 200 : 500)
        .send({ message: status ? "OK" : "Error", post: post });
    }),
    (controller.delete = async function (req, res) {
      var status = false;
      try {
        await models.Post.destroy({
          where: {
            id: req.params.postId,
          },
        });
        var status = true;
      } catch (error) {}
      res.status(status ? 200 : 500).send({ message: status ? "OK" : "Error" });
    }),
    (controller.getPostsTreesByUserID = async function (req, res) {
      var posts = null;
      var user = await models.User.findOne({
        where: { username: req.params.username },
      });
      try {
        posts = await postExtension.getPostsByUserId(user.id);
      } catch (error) {}
      res.status(200).send({ message: posts ? "OK" : "Error", posts: posts });
    }),
    (controller.getRecentPosts = async function (req, res) {
      var posts = null;
      try {
        posts = await postExtension.getRecentPosts(req.user.id, req.body.time);
      } catch (error) {
        console.log("Error happened", error);
      }
      res.status(posts ? 200 : 500).send({ posts: posts });
    }),
    (controller.getComments = async function (req, res) {
      var comments = await postExtension.getPostComments(req.params.postId);
      res.status(comments ? 200 : 500).send({ comments: comments });
    }),
    (controller.search = async function (req, res) {
      var dateFrom = req.params.dateFrom;
      var dateTo = req.params.dateTo;
      if (isNaN(Date.parse(dateFrom))) dateFrom = null;
      if (isNaN(Date.parse(dateTo))) dateTo = null;
      var posts = await postExtension.search(
        req.params.keywords,
        dateFrom,
        dateTo
      );
      res.status(posts ? 200 : 500).send({ posts: posts });
    });
  return controller;
};
