import Vue from "vue";
import Router from "vue-router";

import Register from "../pages/auth/RegisterPage";
import Login from "../pages/auth/LoginPage";
import Home from "../pages/HomePage";
import UserProfile from "../pages/UserProfilePage";
import Chat from "../pages/ChatPage";
import PublicUserProfile from "../pages/UserPublicProfilePage";
import Search from "../pages/Search";
import Post from "../pages/PostPage";
import UserPosts from "../pages/UserPosts";
import EmailVerification from "../pages/auth/EmailVerification";
import LandingPage from "../pages/LandingPage";
import PeoplePage from "../pages/People";

import store from "../store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      //component: Home,
      beforeEnter(to, from, next) {
        console.log("determining the page");
        let components = {
          default: store.getters["auth/isAuth"] ? Home : LandingPage,
        };
        to.matched[0].components = components;
        next();
      },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/profile",
      name: "profile",
      component: UserProfile,
    },
    {
      path: "/chat/:peerUsername?",
      name: "chat",
      component: Chat,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/user/profile/:username",
      name: "user-profile",
      component: PublicUserProfile,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/search/:searchIn/:keywords/:countryCode?/:dateFrom?/:dateTo?",
      name: "search",
      component: Search,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/post/:postId",
      name: "post",
      component: Post,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/post/:postId",
      name: "post",
      component: Post,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/user/posts/:username",
      name: "user-posts",
      component: UserPosts,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/email-verification/:username/:code",
      name: "email-verification",
      component: EmailVerification,
      props: true,
    },
    {
      path: "/people",
      name: "people",
      component: PeoplePage,
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters["auth/isAuth"]) {
      next({
        path: "/",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
