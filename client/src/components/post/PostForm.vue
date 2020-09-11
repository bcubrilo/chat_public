<template>
  <v-dialog
    v-model="postDialogVisible"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }" v-if="mode === 'add'">
      <v-fab-transition>
        <v-btn color="pink" dark fixed bottom right fab v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="postDialogVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t("new-post") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="save()">
            {{
            mode === "add" ? $t("create") : $t("update")
            }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <label v-if="hasError">{{ $t("error-saving-post") }}</label>
        <v-textarea outlined v-model="postModel.content" label="Write something"></v-textarea>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    mode: String,
    post: Object,
    showDialog: Boolean
  },
  name: "PostForm",
  data: () => ({
    postDialogVisible: false,
    postModel: {
      id: null,
      content: ""
    },
    hasError: false
  }),
  watch: {
    showDialog(valOld, valNew) {
      if (this.showDialog) {
        this.postDialogVisible = true;
        this.postModel.id = this.post.id;
        this.postModel.content = this.post.content;
      }
    }
  },
  methods: {
    ...mapActions("post", ["createPost", "updatePost"]),
    save() {
      this.hasError = false;
      if (this.mode === "add") {
        this.createPost({ content: this.postModel.content })
          .then(r => {
            this.postDialogVisible = false;
            this.postModel.id = null;
            this.postModel.content = "";
          })
          .catch(r => (this.hasError = true));
      } else if (this.mode == "update") {
        this.updatePost({
          content: this.postModel.content,
          postId: this.postModel.id
        })
          .then(r => {
            this.$emit("on-post-update", { content: this.postModel.content });
            this.postDialogVisible = false;
            this.postModel.id = null;
            this.postModel.content = "";
          })
          .catch(r => (this.hasError = true));
      }
    }
  }
};
</script>
