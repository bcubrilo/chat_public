<template>
  <div class="name-card">
    <v-card :color="color" ref="card" :dark="dark" :img="cardBgImage">
      <v-responsive v-if="showTopNav">
        <v-layout row justify-space-between class="ma-0">
          <v-flex xs2>
            <v-icon color="pink">favorite</v-icon>
          </v-flex>
          <v-flex xs2 class="text-sm-right">
            <v-icon>more_vert</v-icon>
          </v-flex>
        </v-layout>
      </v-responsive>
      <v-card-text>
        <div v-if="user != null" class="layout ma-0 align-center" :class="computeCardLayout">
          <v-avatar :size="computeAvatarSize" color="primary">
            <img :src="userAvatar(user)" :alt="user.name" v-if="userAvatar(user) != null" />
            <span v-else class="white--text headline">
              {{
              user.name.charAt(0)
              }}
            </span>
          </v-avatar>
          <div class="flex" :class="computeTextAlgin">
            <div class="subheading">{{ user.name }}</div>
          </div>
        </div>
      </v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions class="white-background">
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="toggleLikeProfile"
          :color="likeButtonBackground"
          v-if="user.username !== authUser.username"
        >
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-btn icon @click="sendMessage" v-if="user.username !== authUser.username">
          <v-icon>message</v-icon>
        </v-btn>
        <v-btn icon @click="userProfile">
          <v-icon>arrow_forward</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
const likedButtonBackground = "red";
const defaultLikeButtonBackground = "#E8F5E";
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ""
    },
    avatar: {
      type: Object,
      default: null
    },
    jobTitle: {
      type: String,
      default: ""
    },
    cardBgImage: {
      type: String
    },
    color: {
      type: String,
      default: ""
    },
    dark: {
      type: Boolean,
      default: false
    },
    topNav: {
      type: Boolean,
      default: false
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    likeButtonBackground: defaultLikeButtonBackground
  }),

  computed: {
    computeCardLayout() {
      return this.mini ? "row" : "column";
    },
    computeTextAlgin() {
      return this.mini ? "text-sm-right" : "text-sm-center";
    },
    computeAvatarSize() {
      return "96";
    },
    showAvatar() {
      return this.userAvatar != null;
    },
    showTopNav() {
      return this.mini === false && this.topNav;
    },
    ...mapGetters({
      userAvatar: "usersModule/userAvatar",
      hasLike: "userProfile/hasLike"
    }),
    ...mapState({
      authUser: state => state.auth.user
    })
  },
  created() {
    if (this.hasLike(this.user.username)) {
      this.likeButtonBackground = likedButtonBackground;
    }
  },
  methods: {
    ...mapActions("userProfile", ["likeProfile", "removeProfileLike"]),
    sendMessage() {
      if (this.user != null) {
        this.$router.push({
          name: "chat",
          params: { peerUsername: this.user.username },
          query: { user: this.user }
        });
      }
    },
    userProfile() {
      if (this.user != null) {
        if (this.$isMobile()) {
          this.$router.push({
            name: "user-profile",
            params: { username: this.user.username }
          });
        } else {
          let routeData = this.$router.resolve({
            name: "user-profile",
            params: { username: this.user.username }
          });
          window.open(routeData.href, "_blank");
        }
      }
    },
    toggleLikeProfile() {
      if (this.hasLike(this.user.username)) {
        this.removeProfileLike(this.user.username).then(r => {
          this.likeButtonBackground = defaultLikeButtonBackground;
        });
      } else {
        this.likeProfile(this.user.username).then(
          r => (this.likeButtonBackground = likedButtonBackground)
        );
      }
    }
  }
};
</script>
<style scoped>
.white-background {
  background-color: white;
}
</style>
