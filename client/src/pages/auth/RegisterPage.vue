<template>
  <v-layout align-center>
    <v-form ref="form" v-model="valid" :lazy-validation="lazy" v-if="!registered">
      <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
      <v-text-field
        type="password"
        v-model="password"
        required
        label="Password"
        :rules="passwordRules"
      />
      <v-btn color="error" class="mr-4" @click="registerUser">Register</v-btn>
    </v-form>
    <div v-else>
      <div v-if="registerError">
        <span>{{registerError}}</span>
      </div>
      <div v-else>User is registered!</div>
    </div>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "RegisterPage",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [v => !!v || "Name is required"],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    passwordRules: [v => !!v || "Password is required"],
    lazy: true,
    registered: false
  }),
  computed: {
    ...mapGetters({
      registerError: "auth/registerError"
    })
  },
  methods: {
    ...mapActions("auth", ["register"]),
    registerUser() {
      try {
        this.register({
          name: this.name,
          email: this.email,
          password: this.password
        })
          .then(() => {
            this.registered = true;
          })
          .catch(error => console.log("Uhvatio sam ga//////"));
      } catch (err) {
        console.log("uvatio sam ga");
      }
    }
  }
};
</script>
