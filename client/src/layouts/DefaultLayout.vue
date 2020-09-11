<template>
  <div>
    <v-app-bar app clipped-left>
      <v-toolbar-title class>
        <span class>Chat and meet me</span>
      </v-toolbar-title>
      <v-btn icon @click="$router.push({ name: 'home' })">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon @click="$router.push({ name: 'chat' })">
        <v-icon>mdi-chat</v-icon>
        <span
          class="unreadMessagesCount"
          v-if="totalUnreadMessagesCount > 0"
        >{{ totalUnreadMessagesCount }}</span>
      </v-btn>
      <v-btn icon @click="$router.push({ name: 'people' })">
        <v-icon>mdi-account-group</v-icon>
      </v-btn>
      <v-spacer />
      <v-menu
        origin="center center"
        transition="scale-transition"
        offset-y
        :close-on-content-click="false"
        :v-model="notificationMenuModel"
        ref="notificationMenu"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="showMenuClick">
            <v-icon>mdi-bell</v-icon>
            <span
              class="unreadMessagesCount"
              v-if="unreadNotificationsCount > 0"
            >{{ unreadNotificationsCount }}</span>
          </v-btn>
        </template>
        <v-card width="400" height="300">
          <v-list two-line>
            <v-list-item-group>
              <template>
                <v-list-item disabled>
                  <v-list-item-content>
                    <v-list-item-title>{{$t('notifications')}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
              </template>

              <template v-for="(notification, i) in notifications">
                <v-list-item :key="i" @click="notificationNavigate(notification)">
                  <template>
                    <v-list-item-avatar>
                      <v-img :src="userSmallAvatar(notification.user.profile.profileImageUrl)"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-text="notification.user.name"></v-list-item-title>
                      {{$t(notification.content)}}
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider />
              </template>
            </v-list-item-group>
          </v-list>
          <v-list>
            <v-list-item @click="laodOlderNotifications">
              <v-list-item-content
                :style="{
                  'align-items':'center'
                }"
              >
                <v-btn
                  :loading="loadingNotifications"
                  :disabled="loadingNotifications"
                  text
                  @click="loader = 'loading'"
                >{{$t('more')}}</v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-menu
        offset-y
        offset-x
        origin="center center"
        :nudge-bottom="10"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon large v-on="on">
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list class="pa-0">
            <v-list-item
              v-for="(item, index) in userMenuItems"
              :key="index"
              rel="noopener"
              :to="{ name: item.name }"
              @click="userMenuItemClick(item.name)"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <slot />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "DefaultLayout",
  data() {
    return {
      drawer: false,
      userMenuItems: [
        {
          icon: "account_circle",
          href: "#",
          text: "Profile",
          click: "",
          name: "profile"
        },
        {
          icon: "mdi-notebook-multiple",
          href: "#",
          text: this.$t("posts"),
          click: "",
          name: "user-posts"
        },
        {
          icon: "power",
          href: "#",
          text: "Logout",
          click: "",
          name: "logout"
        }
      ],
      notificationMenuModel: false,
      loadingNotifications: false
    };
  },
  computed: {
    ...mapState({
      userProfile: state => state.userProfile.profile,
      notifications: state => state.notification.notifications,
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      userAvatar: "userProfile/userAvatar",
      userSmallAvatar: "usersModule/userAvatarPath",
      userFirstLetter: "auth/userFirstLetter",
      totalUnreadMessagesCount: "chat/totalUnreadMessaesCount",
      unreadNotificationsCount: "notification/unreadCount",
      notificationRoute: "notification/route"
    })
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    ...mapActions("notification", ["setAsSeen", "getOlderNotifications"]),
    userMenuItemClick(route) {
      if (route === "logout") {
        this.logout();
      } else if (route === "user-posts") {
        this.$router.push({
          name: "user-posts",
          params: { username: this.authUser.username }
        });
      }
    },
    notificationNavigate(notification) {
      this.$router.push(JSON.parse(notification.url));
    },
    showMenuClick() {
      this.$nextTick(() => {
        if (this.$refs.notificationMenu.isActive) {
          this.setAsSeen();
        }
      });
    },
    laodOlderNotifications() {
      this.loadingNotifications = true;
      this.getOlderNotifications()
        .then(r => (this.loadingNotifications = false))
        .catch(er => (this.loadingNotifications = false));
    }
  }
};
</script>
