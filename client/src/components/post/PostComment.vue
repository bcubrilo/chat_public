<template >
  <div>
    <v-row>
      <v-col>
        <div class="comment">
          <div class="comment-image">
            <v-avatar>
              <img :src="userAvatarPath(comment.profileImageUrl)" />
            </v-avatar>
          </div>
          <div class="comment-body">
            <h4>{{comment.name}}</h4>
            <span style="font-size:12px">
              {{
              this.$dateFormat(
              new Date(comment.createdAt).toLocaleString(),
              "dd.mm.yyyy hh:MM"
              )
              }}
            </span>
            <p style="margin-bottom:0">{{comment.content}}</p>
            <div>
              <span class="comment-button" @click="showCommentForm = true">{{$t('comment')}}</span>
              <v-dialog v-model="showDeleteCommentDialog" width="500">
                <template v-slot:activator="{ on }">
                  <span
                    style="display:inline;margin:0 0 0 20px;cursor:pointer;color:red;"
                    v-if="comment.username === authUser.username"
                    v-on="on"
                  >{{$t('delete')}}</span>
                </template>
                <v-card>
                  <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                  >{{$t('delete-comment')}}</v-card-title>
                  <v-card-text>{{$t('delete-comment-question')}}</v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="darken-1"
                      text
                      @click="showDeleteCommentDialog=false"
                    >{{$t('cancel')}}</v-btn>
                    <v-btn
                      color="red darken-1"
                      text
                      @click="deleteComment(comment.id)"
                    >{{$t('delete')}}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <post-comment-form v-if="showCommentForm" @on-submit-comment="submitComment" />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <post-comment
            v-for="(comm,i) in myComments"
            :comment="comm"
            :key="i"
            @on-deleted="onMyCommentDelted"
          />
          <span class="show-comments" v-if="comment.commentsCount >0" @click="showPostComments()">
            <template v-if="!showComments">
              <v-icon>mdi-menu-down</v-icon>
              {{$t('show-comments')}}
            </template>
            <template v-else>
              <v-icon>mdi-menu-up</v-icon>
              {{$t('hide-comments')}}
            </template>
          </span>

          <div class="comments" v-show="showComments">
            <post-comment
              v-for="(comm,i) in comments"
              :comment="comm"
              :key="i"
              @on-deleted="commentDeleted"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: { comment: Object },
  name: "PostComment",
  data: () => ({
    showCommentForm: false,
    comments: [],
    myComments: [],
    showComments: false,
    commentsLoaded: false,
    showDeleteCommentDialog: false
  }),
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    })
  },
  methods: {
    ...mapActions("post", ["getPostComments", "createPost", "delete"]),
    submitComment: function(comment) {
      if (comment.content) {
        this.createPost({
          content: comment.content,
          parentPostId: this.comment.id
        })
          .then(r => {
            this.myComments.unshift(r);
          })
          .catch(error => console.log("error posting comment", error));
      }
      this.showCommentForm = false;
    },
    showPostComments() {
      this.showComments = !this.showComments;
      if (!this.commentsLoaded) {
        this.getPostComments({ postId: this.comment.id })
          .then(r => {
            try {
              var orderedComments = this.$_.orderBy(r, ["createdAt"], ["desc"]);
              this.$_.forEach(orderedComments, comment => {
                if (
                  this.$_.findIndex(this.myComments, c => c.id === comment.id) <
                  0
                )
                  this.comments.push(comment);
              });
            } catch (err) {
              console.log("Error => ", err);
            }
          })
          .catch(error => console.log("jbg", error));
        this.commentsLoaded = true;
      }
    },
    deleteComment(commentId) {
      if (commentId) {
        this.delete({ postId: commentId })
          .then(r => {
            this.showDeleteCommentDialog = false;
            this.$nextTick(() => this.$emit("on-deleted", commentId));
          })
          .catch(e => console.log(e));
      }
    },
    commentDeleted(commentId) {
      this.comments.splice(
        this.$_.findIndex(this.comments, c => c.id === commentId),
        1
      );
    },
    onMyCommentDelted(commentId) {
      this.myComments.splice(
        this.$_.findIndex(this.myComments, c => c.id === commentId),
        1
      );
    }
  }
};
</script>
<style scoped>
.comment {
  display: flex;
  margin: 0px 10px;
}
.comment-image {
  margin-right: 20px;
}
.comment-body {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.show-comments {
  margin-top: 10px;
  margin-left: 60px;
  cursor: pointer;
}
.comment-button {
  cursor: pointer;
}
</style>