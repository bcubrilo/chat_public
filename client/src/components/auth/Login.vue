<template>
  <v-row>
    <v-col cols="12">
      <v-form ref="loginForm">
        <v-text-field v-model="username" :label="usernameEmailLabel" v-on:keydown.enter="loginUser"></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          required
          :label="passwordLabel"
          v-on:keydown.enter="loginUser"
        />
        <v-btn color="error" class="mr-4" @click="loginUser">Login</v-btn>
      </v-form>
    </v-col>
    <v-col cols="12">
      <div v-if="error" style="color:red">{{$t('invalid-credentials')}}</div>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "LoginPage",
  data: () => ({
    username: "",
    password: "",
    error: false
  }),
  computed: {
    passwordLabel() {
      return this.$t("password");
    },
    usernameEmailLabel() {
      return this.$t("username-or-email");
    }
  },
  methods: {
    ...mapActions("auth", ["login"]),
    loginUser() {
      if (!this.$refs.loginForm.validate()) return;
      this.login({ username: this.username, password: this.password })
        .then(() => this.$router.push({ name: "home" }))
        .catch(errors => {
          console.log(errors);
          this.error = true;
        });
    }
  }
};
</script>