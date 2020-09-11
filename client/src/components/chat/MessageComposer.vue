<template>
  <v-row>
    <emoji-mart-vue
      class="emoji-picker"
      emoji="point_up"
      v-show="showEmojiPicker"
      @select="addEmoji"
      set="apple"
      :data="emojiJsonData"
    />
    <v-col cols="12">
      <v-text-field
        v-model="value"
        full-width
        hide-details
        clearable
        multi-line
        auto-grow
        append-icon="send"
        prepend-icon="mdi-emoticon"
        ref="messageComposerText"
        @click:prepend="toggleEmojiPicker"
        @click:append="sendMessage"
        v-on:keydown.enter="sendMessage"
        v-on:keyup="onKeyUp"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script>
import emojiJsonData from "emoji-mart-vue/data/apple.json";
import { NimblePicker } from "emoji-mart-vue";
import emojiHelper from "../../util/emojiHelper";

import urlJoin from "url-join";
import { mapActions } from "vuex";

export default {
  name: "MessageComposer",
  data: () => ({
    value: "",
    emojiMessage: false,
    showEmojiPicker: false,
    formatedValue: "",
    addEmojies: [],
    canSendTyping: true
  }),
  methods: {
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    addEmoji(emoji) {
      const textarea = this.$refs.messageComposerText.$refs.input;
      const cursorPosition = textarea.selectionEnd;
      const start = this.value.substring(0, textarea.selectionStart);
      const end = this.value.substring(textarea.selectionStart);
      const text = start + emoji.native + end;
      this.value = text;
      var emojiInfo = emojiHelper[emoji.unified.toUpperCase()];
      var emojiImageUrl = urlJoin(
        process.env.VUE_APP_IMAGES_REPOSITORY,
        "emoji",
        emojiInfo.image
      );
      var element = `<img src="${emojiImageUrl}"/>`;

      this.formatedValue = start + element + end;
      this.addEmojies.push({ native: emoji.native, unified: emoji.unified });
      this.$refs.messageComposerText.focus();
    },
    sendMessage() {
      this.value = this.value.trim();
      if (!this.value) return;

      var messageCopy = this.value;
      this.$_.forEach(this.addEmojies, emoji => {
        var emojiInfo = emojiHelper[emoji.unified.toUpperCase()];
        var emojiImageUrl = urlJoin(
          process.env.VUE_APP_IMAGES_REPOSITORY,
          "emoji",
          emojiInfo.image
        );
        var imageTag = `<img class="message-emoji" src="${emojiImageUrl}"/>`;
        //this.$_.replace(this.value, emoji.native, imageTag);
        this.value = this.value.replace(emoji.native, imageTag);
        messageCopy = messageCopy.replace(emoji.native, "");
      });

      if (messageCopy.trim() === "") {
        this.emojiMessage = true;
      }
      this.$emit("on-submit-value", {
        text: this.value,
        emojiMessage: this.emojiMessage
      });
      this.showEmojiPicker = false;

      this.$refs.messageComposerText.focus();
      this.addEmojies = [];
      this.value = "";
      this.emojiMessage = false;
    },
    onKeyUp(args) {
      if (this.canSendTyping) {
        if (args.key !== "Enter") {
          this.$emit("on-typing");
        }
        this.canSendTyping = false;
        setTimeout((this.canSendTyping = true), 500);
      }
    }
  }
};
</script>