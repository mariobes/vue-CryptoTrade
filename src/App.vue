<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'

</script>

<template>
  <v-app>
      <header>
        <HeaderComponent></HeaderComponent>
      </header>

      <main>
        <RouterView />
      </main>

      <footer>
        <FooterComponent></FooterComponent>
      </footer>
  </v-app>
</template>

<style scoped>
main {
  flex-grow: 1;
}

html, body, #app, .v-application {
  background-color: rgba(0, 0, 0, 0.95) !important;
  color: white;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

</style>