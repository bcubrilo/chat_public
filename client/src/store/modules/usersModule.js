import api from "../../api/user";
import _ from "lodash";
import urlJoin from "url-join";

const state = {
  mostRecentUsers: null,
  users: [],
  searchedUsers: [],
};

const getters = {
  getByUsername: (state) => (username) => {
    return _.find(state.users, (user) => user.username == username);
  },
  userAvatar: (state) => (user) => {
    var imageUrl = process.env.VUE_APP_AVATAR_IMAGE;
    if (user && user.profileImageUrl && user.profileImageUrl) {
      imageUrl = user.profileImageUrl;
    }
    return urlJoin(
      process.env.VUE_APP_IMAGES_REPOSITORY,
      "big_avatars",
      imageUrl
    );
  },
  userProfileImage: (state) => (user) => {
    var imageUrl = process.env.VUE_APP_AVATAR_IMAGE;
    if (user && user.profileImageUrl) {
      imageUrl = user.profileImageUrl;
    }
    return urlJoin(process.env.VUE_APP_IMAGES_REPOSITORY, "profiles", imageUrl);
  },
  userAvatarPath: (state) => (imageName) => {
    if (!imageName) imageName = process.env.VUE_APP_AVATAR_IMAGE;
    return urlJoin(process.env.VUE_APP_IMAGES_REPOSITORY, "avatars", imageName);
  },
};

const actions = {
  getMostRecentUsers({ commit }) {
    return new Promise((resolve, reject) => {
      api.getMostRecentUsers(
        {},
        (result) => {
          commit("setMostRecentUsers", result.data);
          resolve(result);
        },
        (errors) => reject(errors)
      );
    });
  },
  getUserByUsername({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.getUserPublicProfile(
        data,
        (result) => {
          commit("addUser", result.data);
          resolve(result.data);
        },
        (erorrs) => reject(erorrs)
      );
    });
  },
  search({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.searchUsers(
        data,
        (result) => {
          resolve(result.data);
        },
        (errors) => reject(errors)
      );
    });
  },
};

const mutations = {
  setMostRecentUsers(state, data) {
    state.mostRecentUsers = data;
    _.each(data, (user) => state.users.push(user));
  },
  addUser(state, user) {
    state.users.push(user);
  },
  setSearchedUsers(state, users) {
    state.searchedUsers = users;
    console.log(state.searchedUsers);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
