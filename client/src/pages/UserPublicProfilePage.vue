<template>
  <v-container fluid>
    <v-toolbar card dense flat light class="white chat-toolbar" v-if="$isMobile() === true">
      <v-btn icon @click="$router.go(-1)">
        <v-icon color="text--secondary">keyboard_arrow_left</v-icon>
      </v-btn>
    </v-toolbar>
    <template v-if="user != undefined">
      <v-row align="center" justify="center">
        <v-col lg="10" md="10" sm="12" xs="12" align-self="center">
          <v-card>
            <v-row justify="center">
              <v-col>
                <v-img :src="userProfileImage(user)" class="profile-image" />
              </v-col>
            </v-row>
            <v-card-text>
              <h2 style="text-align:center">{{ user.name }}</h2>
              <p style="text-align:center">@{{ user.username }}</p>
            </v-card-text>
            <v-card-actions class="white-background">
              <v-spacer />
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
              <v-btn
                icon
                class="btn-link"
                @click="$router.push({ name: 'user-posts', params: { username: user.username }})"
              >
                <v-icon>mdi-notebook-multiple</v-icon>
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="user.description" justify="center">
        <v-col lg="10" md="10" sm="12" xs="12">
          <v-card>
            <v-card-text>
              <v-icon>mdi-format-quote-open</v-icon>
              {{user.description}}
              <v-icon>mdi-format-quote-close</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col lg="10" md="10" sm="12" xs="12">
          <v-card>
            <v-list-item>
              <v-list-item-content>
                <v-col cols="6">
                  <v-list-item-title>{{$t('gender')}}</v-list-item-title>
                </v-col>
                <v-col cols="6">
                  <v-list-item-title>{{gender}}</v-list-item-title>
                </v-col>
                <v-divider />
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-col cols="6">
                  <v-list-item-title>{{$t('interested-in-gender')}}</v-list-item-title>
                </v-col>
                <v-col cols="6">
                  <v-list-item-title>{{interestedGender}}</v-list-item-title>
                </v-col>
                <v-divider />
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-col cols="6">
                  <v-list-item-title>{{$t('country')}}</v-list-item-title>
                </v-col>
                <v-col cols="6">
                  <v-list-item-title>{{userCountryName}}</v-list-item-title>
                </v-col>
                <v-divider />
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-col cols="6">
                  <v-list-item-title>{{$t('languages')}}</v-list-item-title>
                </v-col>
                <v-col cols="6">
                  <v-list-item-title>{{languages}}</v-list-item-title>
                </v-col>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
const countryList = require("country-list");
import ISO6391 from "iso-639-1";
export default {
  name: "UserProfile",
  data: () => ({
    user: Object
  }),
  computed: {
    ...mapGetters({
      getByUsername: "usersModule/getByUsername",
      userAvatar: "usersModule/userAvatar",
      userProfileImage: "usersModule/userProfileImage"
    }),
    ...mapState({
      authUser: state => state.auth.user
    }),
    userCountryName() {
      if (this.user != undefined && this.user.countryCode != undefined) {
        return countryList.getName(this.user.countryCode);
      }
    },
    hasCountry() {
      return this.user != undefined && this.user.countryCode != undefined;
    },
    gender() {
      if (this.user != undefined) {
        return this.user.gender === "M" ? "Male" : "Female";
      }
    },
    interestedGender() {
      if (this.user !== undefined) {
        var res = "";
        switch (this.user.interestedInGender) {
          case "M":
            res = "Male";
            break;
          case "F":
            res = "Female";
            break;
          case "B":
            res = "Male and Female";
            break;
          default:
            break;
        }
        return res;
      }
    },
    languages() {
      var langs = "";

      if (this.user.languageCode && this.user.languageCode.length > 0) {
        var languageCodes = this.user.languageCode.split(",");
        var tmp = ISO6391.getLanguages(languageCodes);
        langs = this.$_.map(tmp, "name").join(", ");
      }
      return langs;
    }
  },
  mounted: function() {
    let user = this.getByUsername(this.$route.params.username);
    if (user === undefined) {
      this.getUserByUsername({
        username: this.$route.params.username
      });
    }
    user = this.getByUsername(this.$route.params.username);
    this.user = user;
  },
  methods: {
    ...mapActions("usersModule", ["getUserByUsername"]),
    sendMessage() {
      if (this.user != undefined)
        this.$router.push({
          name: "chat",
          params: { peerUsername: this.user.username }
        });
    }
  }
};
</script>
<style scoped>
.profile-detail {
  padding: 10px 0;
}
.label {
  display: block;
  font-size: 12px;
  color: darkgrey;
  margin: 10px 0;
}
.profile-image {
  max-width: 450px;
  max-height: 450px;
  margin-left: auto;
  margin-right: auto;
  background: gray;
}
.btn-link a {
  text-decoration: none !important;
  color: unset !important;
}
</style>
