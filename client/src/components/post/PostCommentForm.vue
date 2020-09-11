<template>
  <div class="comment-input-wrapper">
    <v-avatar>
      <v-img :src="userAvatarPath(authUser.profileImageUrl)" />
    </v-avatar>
    <div class="comment-form">
      <v-text-field
        placeholder="Comment"
        v-model="commentText"
        @focus="showCommentSubmitButtons=true"
      />
      <div class="comment-form-buttons" v-if="showCommentSubmitButtons">
        <v-btn @click="cancelComment" style="margin-right:20px">{{$t('cancel')}}</v-btn>
        <v-btn @click="submitComment" :disabled="!commentText">{{$t('submit')}}</v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "PostEditForm",
  data: () => ({
    showCommentSubmitButtons: false,
    commentText: ""
  }),
  computed: {
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    }),
    ...mapState({
      authUser: state => state.auth.user
    })
  },
  methods: {
    cancelComment() {
      this.showCommentSubmitButtons = false;
      this.commentText = "";
    },
    submitComment() {
      this.$emit("on-submit-comment", { content: this.commentText });
      this.commentText = "";
      this.showCommentSubmitButtons = false;
    }
  }
};
</script>
<style scoped>
.post-comments {
  margin: 20px;
}
.comment-input-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 10px 0px;
}
.comment-form {
  margin: 0 0 0 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>