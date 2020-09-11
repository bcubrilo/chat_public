<template>
  <v-layout>
    <v-form>
      <v-text-field v-model="username" label="Username or email"></v-text-field>
      <v-text-field type="password" v-model="password" required label="Password" />
      <v-btn color="error" class="mr-4" @click="loginUser">Login</v-btn>
    </v-form>
    <div v-if="error">Invalid credentials</div>
  </v-layout>
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
  methods: {
    ...mapActions("auth", ["login"]),
    loginUser() {
      this.login({ email: this.username, password: this.password })
        .then(() => this.$router.push({ name: "home" }))
        .catch(errors => {
          console.log(errors);
          this.error = true;
        });
    }
  }
};
</script>