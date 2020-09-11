<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card v-if="user">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="userAvatarPath(user.profileImageUrl)"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{$t('posts')}} by {{user.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="posts">
      <v-col lg="6" md="12" sm="12" xs="12" v-for="(post, i) in posts" :key="i">
        <post :post="post" :clickable="true" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "UserPosts",
  data: () => ({
    posts: [],
    user: null
  }),
  mounted() {
    this.getUserPosts({ username: this.$route.params.username })
      .then(r => {
        this.posts = r;
      })
      .catch(er => console.log(er));
    this.user = this.getByUsername(this.$route.params.username);
    if (!this.user)
      this.getUserByUsername({
        username: this.$route.params.username
      }).then(r => (this.user = r));
  },
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath",
      getByUsername: "usersModule/getByUsername"
    })
  },
  methods: {
    ...mapActions("post", ["getUserPosts"]),
    ...mapActions("usersModule", ["getUserByUsername"])
  }
};
</script>