<template>
  <v-container>
    <v-toolbar card dense flat light class="white chat-toolbar" v-if="$isMobile()">
      <v-btn icon @click="$router.go(-1)">
        <v-icon color="text--secondary">keyboard_arrow_left</v-icon>
      </v-btn>
    </v-toolbar>
    <v-row>
      <v-col>
        <post :post="post" />
        <post-comment-form @on-submit-comment="submitComment" />
        <div class="post-comments" v-if="comments">
          <template v-for="(comment,i) in comments">
            <post-comment :comment="comment" :key="i" @on-deleted="commentDeleted"></post-comment>
          </template>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "PostPage",
  data: () => ({
    postTree: Object,
    posts: [],
    showCommentSubmitButtons: false,
    commentText: "",
    comments: [],
    post: null,
    isMounted: false
  }),
  mounted: function() {
    this.isMounted = true;
    this.getPostData(this.$route.params.postId);
  },
  watch: {
    $route(to, from) {
      if (this.isMounted) {
        this.getPostData(this.$route.params.postId);
      }
    }
  },
  computed: {
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    }),
    ...mapState({
      authUser: state => state.auth.user
    })
  },
  methods: {
    ...mapActions("post", ["getPost", "createPost"]),
    buildPostTree(post, parentPost) {
      if (!post.parentPostId) {
        this.postTree = post;
      } else {
        if (!parentPost.children) parentPost.children = [];
        parentPost.children.push(post);
      }
      var children = this.$_.filter(
        this.posts,
        p => p.parentPostId === post.id
      );
      console.log("Children", children);
      if (children) this.$_.forEach(children, p => this.buildPostTree(p, post));
    },
    submitComment: function(comment) {
      if (comment.content) {
        this.createPost({
          content: comment.content,
          parentPostId: this.post.id
        })
          .then(r => {
            var tmp = [r, ...this.comments];
            this.comments = [];
            this.$nextTick(() => (this.comments = tmp));
          })
          .catch(error => console.log("error posting comment", error));
      }
    },
    commentDeleted(commentId) {
      console.log("comment is to be deleetd");
      this.comments.splice(
        this.$_.findIndex(this.comments, c => c.id === commentId),
        1
      );
    },
    getPostData(postId) {
      this.getPost({ postId: postId }).then(result => {
        this.posts = result;
        this.post = this.$_.find(this.posts, p => !p.parentPostId);
        var comments = this.$_.filter(
          this.posts,
          p => p.parentPostId === this.post.id
        );
        console.log("Unorted comments", comments);
        if (comments)
          this.comments = this.$_.orderBy(comments, ["cratedAt"], ["desc"]);
        console.log("Sorted comments", this.comments);
      });
    }
  }
};
</script>
<style scoped>
</style>