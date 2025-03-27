<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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

* {
  background-color: rgb(18, 12, 68);
}

</style>