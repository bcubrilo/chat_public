<template>
  <div v-if="channel != null">
    {{channelName(channel)}}
    <v-btn @click="deleteChannelLocal">
      <v-icon>delete</v-icon>
    </v-btn>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    channel: Object
  },
  name: "Channel",
  computed: {
    ...mapGetters({
      channelName: "chat/channelName"
    })
  },
  methods: {
    ...mapActions("chat", ["deleteChannel", "deleteTmpChannel"]),
    deleteChannelLocal() {
      console.log("Deleting channel " + JSON.stringify(this.channel));
      if (this.channel.id != undefined && this.channel.id > 0) {
        let promise = this.deleteChannel(this.channel);
        promise.then(result => {
          this.$router.push({ name: "chat" });
        });
      } else {
        let promise1 = this.deleteTmpChannel({
          channel: this.channel,
          vm: this
        });
        promise1.then(r => {
          this.$router.push({ name: "chat" });
        });
      }
    }
  }
};
</script>