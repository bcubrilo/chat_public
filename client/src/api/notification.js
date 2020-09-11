import util from "./util";
export default {
  unread(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/notifications/unread",
      params,
      cb,
      errorCb
    );
  },
  previous(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/notifications/previous/" + params.date,
      params,
      cb,
      errorCb
    );
  },
  setSeen(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/notifications/set-seen",
      params,
      cb,
      errorCb
    );
  },
  delete(params, cb, errorCb) {
    return util.request(
      "delete",
      "/api/notification/" + params.id,
      cb,
      errorCb
    );
  },
};
