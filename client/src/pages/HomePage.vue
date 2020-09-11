<template>
  <v-container grid-list-xl fluid>
    <search-form @on-search="search" />

    <v-row v-if="posts">
      <v-col lg="6" md="12" sm="12" xs="12" v-for="(post, i) in posts" :key="i">
        <post :post="post" @update-post-action="updatePost(post)" :clickable="true" />
      </v-col>
    </v-row>
    <post-form mode="add"></post-form>
  </v-container>
</template>
<script>
import DefaultLayout from "../layouts/DefaultLayout";
import LandingLayout from "../layouts/LandingLayout";
import { mapState, mapActions } from "vuex";

export default {
  name: "HomePage",
  data: () => ({
    isSearchActive: false,
    searchPhrase: "",
    addPostDialog: false,
    postModel: {
      title: "",
      content: ""
    },
    editPostDialogVisible: false,

    showDetailSearch: false
  }),
  computed: {
    ...mapState({
      mostRecentUsers: state => state.usersModule.mostRecentUsers,
      searchedUsers: state => state.usersModule.searchedUsers,
      posts: state => state.post.posts
    }),
    searchForPeopleLabel: function() {
      return this.$t("search-for-people");
    }
  },
  mounted: function() {},
  created() {
    this.$emit("update:layout", LandingLayout);
    if (this.mostRecentUsers == null) {
      this.getMostRecentUsers();
    }
    this.getRecentPosts();
  },
  methods: {
    ...mapActions("usersModule", ["getMostRecentUsers"]),
    ...mapActions("post", ["getRecentPosts"]),

    search(data) {
      console.log("on-search");
      this.$router.push({
        name: "search",
        params: {
          searchIn: data.searchIn,
          keywords: data.keywords,
          countryCode: data.countryCode,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo
        }
      });
    },
    sendMessage(username) {
      this.$router.push({ name: "chat", params: { peerUsername: username } });
    },
    updatePost(post) {
      this.postModel = post;
      this.editPostDialogVisible = true;
    }
  }
};
</script>
