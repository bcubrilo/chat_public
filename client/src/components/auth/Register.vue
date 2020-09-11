<template>
  <v-row align="start">
    <v-col cols="12" sm="12">
      <v-form ref="form" v-model="valid" :lazy-validation="lazy" v-if="!registered">
        <v-text-field v-model="name" :rules="nameRules" :label="localization.name" required></v-text-field>
        <v-text-field
          autocomplete="false"
          v-model="username"
          :rules="usernameRules"
          :label="localization.username"
          required
        ></v-text-field>
        <v-text-field
          autocomplete="false"
          v-model="email"
          :rules="emailRules"
          :label="localization.email"
          required
        ></v-text-field>
        <v-text-field
          autocomplete="new-password"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          required
          :label="localization.password"
          :rules="passwordRules"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="repeatPassword"
          required
          :label="localization.repeatPassword"
          :rules="[passwordConfirmationRule,passwordRules]"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showConfirmPassword = !showConfirmPassword"
        />

        <v-btn color="error" class="mr-4" @click="registerUser">{{$t('register')}}</v-btn>
      </v-form>
    </v-col>
    <v-col v-if="registered || registerError" cols="12" sm="12">
      <div style="color:red">{{registerError}}</div>
      <div v-if="registered">User is registered!</div>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "RegisterPage",
  data: () => ({
    valid: true,
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    username: "",
    lazy: true,
    registered: false,
    registerError: "",
    showPassword: false,
    showConfirmPassword: false
  }),
  computed: {
    passwordConfirmationRule() {
      return (
        this.password === this.repeatPassword ||
        this.localization.passwordNotMatching
      );
    },
    localization() {
      return {
        male: this.$t("male"),
        female: this.$t("female"),
        name: this.$t("name"),
        username: this.$t("username"),
        password: this.$t("password"),
        repeatPassword: this.$t("repeat-password"),
        email: this.$t("email"),
        userRegisteredMessage: this.$t("user-registered-message"),
        passwordNotMatching: this.$t("password-not-matching"),
        nameRequired: this.$t("name-required"),
        nameRules: this.$t("name-rules"),
        emailRequired: this.$t("email-required"),
        passwordRequired: this.$t("password-required"),
        usernameRequired: this.$t("username-required"),
        emailMustBeValid: this.$t("email-must-be-valid"),
        passwordRules: this.$t("password-rules"),
        usenameMustBeValid: this.$t("username-must-be-valid")
      };
    },
    nameRules() {
      return [
        v => !!v || this.localization.nameRequired,
        v =>
          /^[a-zA-Z]+(([' ][a-zA-Z ])?[a-zA-Z]*)*$/.test(v) ||
          this.localization.nameRules
      ];
    },

    emailRules() {
      return [
        v => !!v || this.localization.emailRequired,
        v => /.+@.+\..+/.test(v) || this.localization.emailMustBeValid
      ];
    },

    passwordRules() {
      return [
        v => !!v || this.localization.passwordRequired,
        v =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_=;,<>!~?@#$%^&*])(?=.{8,})/.test(
            v
          ) || this.localization.passwordRules
      ];
    },

    usernameRules() {
      return [
        v => !!v || this.localization.usernameRequired,
        v =>
          /^(?!.*[_\.]{2,})(?=^[^_\.].*[^_\.]$)[a-zA-Z](\w|\.){4,20}$/.test(
            v
          ) || this.localization.usenameMustBeValid
      ];
    }
  },
  mounted() {
    this.$refs.form.reset();
  },
  methods: {
    ...mapActions("auth", ["register"]),
    registerUser() {
      if (!this.$refs.form.validate()) return;
      this.register({
        name: this.name,
        email: this.email,
        password: this.password,
        repeat_password: this.repeatPassword,
        username: this.username
      })
        .then(() => {
          this.registered = true;
          this.registerError = "";
        })
        .catch(error => (this.registerError = error));
    }
  }
};
</script>
