<template>
  <v-row justify="center" align="start">
    <v-col cols="12" sm="6" align-self="center">
      <p>Dobro dosli na chat and meet me</p>
    </v-col>
    <v-col cols="12" sm="6">
      <v-tabs>
        <v-tab>{{$t('login')}}</v-tab>
        <v-tab>{{$t('register')}}</v-tab>

        <v-tab-item height="200">
          <v-card tile>
            <v-card-text>
              <auth-login />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat tile>
            <v-card-text>
              <auth-register />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "LandingPage"
};
</script>