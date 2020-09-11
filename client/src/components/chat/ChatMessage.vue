<template>
  <div
    v-if="message != null"
    :class="[message.isMine ? 'reverse' : '']"
    class="messaging-item layout row my-4"
    :key="message.uuId"
    :id="htmlDivId"
  >
    <div class="messaging--body layout column mx-5" :class="[message.isMine ? 'reverse' : '']">
      <div>
        <template v-if="message.isEmojiMessage">
          <div
            :value="true"
            :class="[
          message.isMine ? 'right' : '', 'emoji-message'
        ]"
            class="pa-1"
            v-html="message.content"
          />
        </template>
        <template v-else>
          <div
            :value="true"
            :class="[
          message.isMine ? 'deep-purple darken-1 white--text' : 'deep-purple lighten-5 black--text'
        ]"
            class="pa-5 message-content"
            v-html="message.content"
          />
        </template>

        <div
          class="caption px-2 text--secondary"
          v-if="message.createdAt != undefined"
          :class="[message.isMine ? 'right' : '']"
        >
          {{
          this.$dateFormat(
          new Date(message.createdAt).toLocaleString(),
          "dd.mm.yyyy hh:MM"
          )
          }}
        </div>
      </div>
    </div>
    <v-spacer></v-spacer>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    message: Object,
    userImageUrl: String
  },
  name: "ChatMessage",
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      userAvatar: "chat/userAvatar"
    }),
    htmlDivId() {
      return "chat-message-" + this.message.uuId || "";
    }
  }
};
</script>
<style>
.right {
  text-align: right;
}
.message-emoji {
  width: 25px;
  height: auto;
}
.emoji-message .message-emoji {
  width: auto !important;
}
.messaging--body {
  flex-direction: row !important;
  max-width: 50%;
}
.messaging--body.reverse {
  flex-direction: row-reverse !important;
}
.message-content {
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
  border-bottom-right-radius: 1em;
}
.messaging--body.reverse .message-content {
  border-bottom-left-radius: 1em;
  border-bottom-right-radius: 0;
}
@media only screen and (max-width: 600px) {
  .messaging--body {
    max-width: 70%;
  }
}
</style>
