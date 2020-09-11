import util from "./util";
export default {
  getProfile(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/profile/user-profile/" + params,
      params,
      cb,
      errorCb
    );
  },
  saveProfile(params, cb, errorCb) {
    return util.request("post", "/api/profile", params, cb, errorCb);
  },
  getChannels(params, cb, errorCb) {
    return util.request("get", "/api/channels", params, cb, errorCb);
  },
  updateProfile(params, cb, errorCb) {
    return util.request("post", "/api/profile/update", params, cb, errorCb);
  },
  updateUser(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/profile/update-user",
      params,
      cb,
      errorCb
    );
  },
  uploadProfileImage(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/profile/upload-profile-image",
      params,
      cb,
      errorCb
    );
  },
  deleteProfileImage(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/profile/delete-profile-image",
      params,
      cb,
      errorCb
    );
  },
  getMostRecentUsers(params, cb, errorCb) {
    return util.request("get", "api/users/most-recent", params, cb, errorCb);
  },
  getUserPublicProfile(params, cb, errorCb) {
    return util.request(
      "get",
      "api/users/public-profile/" + params.username,
      params,
      cb,
      errorCb
    );
  },
  searchUsers(params, cb, errorCb) {
    return util.request(
      "get",
      `api/users/search/${params.keywords}/${params.countryCode}/${
        params.skip
      }`,
      params,
      cb,
      errorCb
    );
  },
  getProfileLikes(params, cb, errorCb) {
    return util.request("get", "api/profile-likes", params, cb, errorCb);
  },
  likeProfile(params, cb, errorCb) {
    return util.request("post", "api/profile-likes", params, cb, errorCb);
  },
  getMyProfileLikes(params, cb, errorCb) {
    return util.request(
      "get",
      "api/profile-likes/all-likes",
      params,
      cb,
      errorCb
    );
  },
  removeProfileLIke(params, cb, errorCb) {
    return util.request(
      "delete",
      "api/profile-likes/" + params.username,
      params,
      cb,
      errorCb
    );
  },
  changePassword(params, cb, errorCb) {
    return util.request("post", "api/change-password", params, cb, errorCb);
  },
};
