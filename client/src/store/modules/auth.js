import api from "../../api/auth";

import router from "../../router";
const state = {
  user: null,
  token: null,
  registerError: null,
};

const getters = {
  check: (state) => {
    return !!state.user;
  },
  token: (state) => {
    return state.token;
  },
  isAuth: (state) => {
    return !!state.user;
  },
  userFirstLetter: (state) => {
    return state.user.name.charAt(0);
  },
  registerError: (state) => {
    return state.registerError ? state.registerError.response.data : false;
  },
  appLanguageCode: (state) => {
    return state.user.appLanguageCode || "en";
  },
};

const actions = {
  login({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      api.login(
        credentials,
        (result) => {
          commit("setUser", result.data);
          dispatch("chat/getChannels", null, { root: true });
          dispatch("userProfile/getProfile", null, { root: true });
          dispatch("userProfile/getProfilesILike", null, { root: true });
          dispatch("notification/getUnread", null, { root: true });

          resolve(result.data);
          router.push("home");
        },
        (errors) => {
          reject(errors);
        }
      );
    });
  },
  register({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      api.register(
        credentials,
        (result) => {
          resolve(result.data);
        },
        (error) => {
          try {
            reject(error);
          } catch (err) {}
        }
      );
    });
  },
  logout() {
    router.push("");
    localStorage.removeItem("vuex");
    location.reload();
  },
  verifyEmail({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.verifyEmail(
        data,
        (result) => resolve(result),
        (errors) => reject(errors)
      );
    });
  },
};

const mutations = {
  setUser(state, authData) {
    state.user = authData.user;
    state.token = authData.token;
  },
  setRegisterError(state, error) {
    state.registerError = error;
  },
  updateUser(state, data) {
    console.log("updating user", data);
    if (state.user) {
      switch (data.field) {
        case "email":
          state.user.email = data.value;
          break;
        case "name":
          state.user.name = data.value;
          break;
        default:
          break;
      }
    }
    console.log("new state ,", state.user);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
