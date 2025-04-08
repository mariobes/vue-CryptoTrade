<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'

const storeUserPreferences = useUserPreferencesStore()

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)

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
  background-color: v-bind(backgroundColor);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
  /* font-family: 'Montserrat', sans-serif; */
}




</style>