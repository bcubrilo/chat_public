<template>
  <v-container fluid class="fill-height">
    <v-app-bar app color="#9c27b0" dark>
      <v-toolbar-title class>
        <span class>Chat and meet me</span>
      </v-toolbar-title>
    </v-app-bar>
    <slot />
  </v-container>
</template>
<script>
export default {
  name: "LandingLayout"
};
</script>