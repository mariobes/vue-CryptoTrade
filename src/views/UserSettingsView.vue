<script setup lang="ts">
import { computed } from 'vue'
import UserSettings from '@/components/User/UserSettings.vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

</script>

<template>
  <div class="main-container">
    <UserSettings></UserSettings>
  </div>
</template>

<style scoped>
.main-container {
	max-width: 60vw;
	margin: 50px auto 50px auto;
}
</style>
