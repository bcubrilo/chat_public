import api from "../../api/notification";
import _ from "lodash";
import notification from "../../api/notification";
import Vue from "vue";
const state = {
  notifications: [],
};
const getters = {
  unreadCount: (state) => _.filter(state.notifications, (n) => !n.seen).length,
  route: (state) => (notification) => {
    var parts = notification.url.split("/");
    if (parts && parts.length > 1) {
      return {
        name: parts[0],
        params: parts[0] == "post" ? { postId: parts[1] } : {},
      };
    }
    return "";
  },
  unread: (state) => {
    var nots = _.filter(state.notifications, (n) => !n.seen);
    return nots;
  },
};
const actions = {
  getUnread({ commit }) {
    return new Promise((resolve, reject) => {
      api.unread(
        {},
        (result) => {
          resolve(result.notifications);
          commit("addNotifications", result.notifications);
        },
        (errors) => reject(errors)
      );
    });
  },
  getOlderNotifications({ commit, state }) {
    var lastTime = new Date();
    if (state.notifications && state.notifications.length > 0)
      lastTime = state.notifications[state.notifications.length - 1].createdAt;

    return new Promise((resolve, reject) => {
      api.previous(
        {
          date: lastTime,
        },
        (result) => {
          resolve(result.notifications);
          commit("addNotifications", result.notifications);
        },
        (errors) => reject(errors)
      );
    });
  },

  setAsSeen({ commit }) {
    return new Promise((resolve, reject) => {
      api.setSeen(
        {},
        (result) => {
          resolve(result.message);
          commit("setSeen", {});
        },
        (errors) => reject(errors)
      );
    });
  },
};
const mutations = {
  addNotifications(state, notifications) {
    console.log("I have new nots", notifications);
    if (notifications && notifications.length > 0) {
      if (Array.isArray(notifications)) {
        var sorted = _.reverse(
          _.sortBy(notifications, (n) => new Date(n.createdAt))
        );
        console.log("Sorted =>", sorted);
        state.notifications.push(...sorted);
      } else {
        state.notifications.unshift(notifications);
      }
    }
  },
  setSeen(state) {
    _.filter(state.notifications, (n) => !n.seen).forEach((n) => {
      Vue.set(n, "seen", true);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
