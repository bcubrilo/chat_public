import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import userProfile from "./modules/userProfile";
import chat from "./modules/chat";
import usersModule from "./modules/usersModule";
import post from "./modules/post";
import notification from "./modules/notification";

import createPersistedState from "vuex-persistedstate";
import socket from "../plugins/socket";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState(), socket()],
  modules: {
    auth,
    userProfile,
    chat,
    usersModule,
    post,
    notification,
  },
});
