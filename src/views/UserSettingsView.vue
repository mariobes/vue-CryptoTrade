<script setup lang="ts">
import { computed } from 'vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

</script>

<template>
  <div class="main-container">
    <div class="title-container">
      <p class="title-text">User Settings</p>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 70vw;
  margin: 0 auto;
}

.title-container {
  margin: 50px 0;
}

.title-text {
  font-size: 2rem;
  color: v-bind(textColor);
  font-weight: bold;
}


</style>
