import util from "./util";

export default {
  createChannel(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/chat/create-channel",
      params,
      cb,
      errorCb
    );
  },
  getChannels(params, cb, errorCb) {
    return util.request("get", "/api/chat/channels", params, cb, errorCb);
  },
  saveMessage(params, cb, errorCb) {
    return util.request("post", "/api/chat/save-message", params, cb, errorCb);
  },
  getChannelMessages(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/chat/channel-messages",
      params,
      cb,
      errorCb
    );
  },
  setMessagesSeen(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/chat/set-messages-seen",
      params,
      cb,
      errorCb
    );
  },
  deleteChannel(params, cb, errorCb) {
    return util.request(
      "delete",
      `/api/chat/delete-channel/`,
      params,
      cb,
      errorCb
    );
  },
};
