<template>
  <v-container>
    <v-row>
      <v-col>
        <h4>Email verification</h4>
      </v-col>
    </v-row>
    <v-row v-if="isError">
      <v-col>Error happend verifying email</v-col>
      <v-col>
        <v-btn>Send another email</v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">{{response}}</v-col>
      <v-col cols="12">
        <v-btn @click="$router.push({ name: 'home' })">{{$t('home')}}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "EmailVerification",
  data: () => ({
    response: "",
    isError: false
  }),
  mounted: function() {
    this.verifyEmail({
      username: this.$route.params.username,
      code: this.$route.params.code
    })
      .then(r => (this.response = r.message))
      .catch(error => (this.isError = "Error happend!"));
  },
  methods: {
    ...mapActions({
      verifyEmail: "auth/verifyEmail"
    })
  }
};
</script>