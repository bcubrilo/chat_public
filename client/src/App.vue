<template>
  <v-app id="app">
    <v-content>
      <v-container fluid fill-height class="grey lighten-4" style="padding:0">
        <v-layout>
          <v-flex>
            <component :is="layout">
              <router-view />
            </component>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const defaultLayout = "default-layout";
const landingLayout = "landing-layout";
import { mapGetters } from "vuex";

export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    items: [
      { icon: "mdi-home", text: "Home", name: "home" },
      { icon: "lightbulb_outline", text: "Register", name: "register" },
      { icon: "lightbulb_outline", text: "Login", name: "login" },
      { icon: "mdi-account", text: "Profile", name: "profile" },
      { icon: "mdi-chat", text: "Chat", name: "chat" }
    ]
  }),
  computed: {
    ...mapGetters({
      isAuth: "auth/isAuth"
    }),
    layout() {
      return this.isAuth ? defaultLayout : landingLayout;
    }
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>