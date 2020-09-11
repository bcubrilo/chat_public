<template>
  <v-row>
    <v-col>{{message.content}}</v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    message: Object
  },
  name: "Message"
};
</script>