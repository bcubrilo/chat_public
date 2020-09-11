<template>
  <v-list rounded>
    <template v-if="!showMyProfileLikes">
      <v-list-item
        v-for="(like, index) in profilesILike"
        :key="index"
        @click="$router.push({
            name: 'user-profile',
            params: { username: like.likedUser.username }})"
      >
        <v-list-item-avatar>
          <v-img :src="userAvatarPath(like.likedUser.profile.profileImageUrl || '')"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="like.likedUser.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="removeLike(like.likedUser.username)">
            <v-icon color="grey lighten-1">delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </template>
    <template v-else>
      <v-list-item
        v-for="like in myProfileLikes"
        :key="like.id"
        @click="$router.push({
            name: 'user-profile',
            params: { username: like.user.username }})"
      >
        <v-list-item-avatar>
          <v-img :src="userAvatarPath(like.user.profile.profileImageUrl || '')"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="like.user.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: {
    showMyProfileLikes: Boolean
  },
  name: "Likes",
  data: () => ({}),
  computed: {
    ...mapState({
      myProfileLikes: state => state.userProfile.myProfileLikes,
      profilesILike: state => state.userProfile.profilesILike
    }),
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    })
  },
  created() {
    if (this.showMyProfileLikes) {
      this.getMyProfileLikes();
    }
  },
  methods: {
    ...mapActions("userProfile", [
      "getProfilesILike",
      "getMyProfileLikes",
      "removeProfileLike"
    ]),
    removeLike(username) {
      this.removeProfileLike(username);
    }
  }
};
</script>