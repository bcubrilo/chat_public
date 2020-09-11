var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var passport = require("passport");
var _ = require("lodash");

var userExtension = require("./models_extension/userExtension");
var channelExtension = require("./models_extension/channelExtension");
var chat = require("./models_extension/chat");

var allowedOrigis = "*:*, http://192.168.1.193:*, http://localhost:*";

const socketManager = require("./lib/socketManager");

var io = require("socket.io")(3031, {
  origins: allowedOrigis,
});

io.on("connection", function (socket) {
  socket.emit("userconnected", { data: "You are connected now" });
  socket.on("map_sockets", async (data) => {
    var userId = userExtension.jwtGetPayload(data);
    if (userId) {
      socketManager.addSocket(userId, socket);
      var channelIds = await channelExtension.findChannelIdsForUser(userId);
      if (channelIds) {
        socketManager.joinChannels(userId, channelIds);
      }
    }
  });
  socket.on("authenticate", async (data) => {
    if (data) {
      var userId = userExtension.jwtGetPayload(data);
      if (userId) {
        socketManager.addSocket(userId, socket);
        var channelIds = await channelExtension.findChannelIdsForUser(userId);
        if (channelIds) {
          socketManager.joinChannels(userId, channelIds);
        }
      }
    }
  });
  socket.on("disconnect", () => {
    socketManager.removeSocket(socket.userId, socket);
  });

  socket.on("save_message", async (data) => {
    var msgData = await chat.saveMessage(data);
    var channel = null;
    if (data.message.joinChannel) {
      socketManager.joinChannel(socket.userId, data.message.channelUuId);
      socketManager.joinChannel(
        `${msgData.receiverId}`,
        data.message.channelUuId
      );
      channel = await channelExtension.findChanelsExtendedByIds([
        msgData.channelId,
        msgData.receiverId,
      ]);
    }
    socket.to(data.message.channelUuId).emit("new_message", {
      message: msgData.receiverMessage,
      channelUuId: data.message.channelUuId,
      channel: channel,
    });
    socket.emit("update_message_data", {
      messageUuId: msgData.originalMessage.uuId,
      tmpId: data.tmpId,
      channelUuId: data.message.channelUuId,
      createdAt: msgData.originalMessage.createdAt,
    });
  });
  socket.on("user_typing", async (data) => {
    socket.to(data.channel).emit("peer_typing", data);
  });
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api")({
  io: io,
  socketManager: socketManager,
});

var app = express();
app.use(cors("http://localhost:8080"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("./passport");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.use(express.static("public"));
global.__basedir = __dirname;
module.exports = app;
