import util from "./util";
export default {
  get(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/post/" + params.postId,
      params,
      cb,
      errorCb
    );
  },
  create(params, cb, errorCb) {
    return util.request("post", "/api/post", params, cb, errorCb);
  },
  update(params, cb, errorCb) {
    return util.request("put", "/api/post", params, cb, errorCb);
  },
  userPosts(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/post/user/" + params.username,
      params,
      cb,
      errorCb
    );
  },
  delete(params, cb, errorCb) {
    return util.request(
      "delete",
      "/api/post/" + params.postId,
      params,
      cb,
      errorCb
    );
  },
  recentPosts(params, cb, errorCb) {
    return util.request("post", "/api/post/recent", params, cb, errorCb);
  },
  getComments(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/post/comments/" + params.postId,
      params,
      cb,
      errorCb
    );
  },
  search(params, cb, errorCb) {
    return util.request(
      "get",
      `/api/post/search/${params.keywords}/${params.dateFrom ||
        null}/${params.dateTo || null}`,
      params,
      cb,
      errorCb
    );
  },
};
