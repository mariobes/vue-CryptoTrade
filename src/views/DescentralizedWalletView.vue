<script setup lang="ts">
import { computed } from 'vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()
</script>

<template>
  <div class="main-container">
    <div class="title-container">
      <p class="title-text">CryptoTrade Wallet</p>
    </div>
    <div class="content-container"> 
      <p class="content-text">{{ t('DescentralizedWallet_Text') }}</p>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 30vw;
  height: 75vh;
  background-color: v-bind(backgroundTable);
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5) !important;
  border: solid 1px var(--dark-gray-color);
  margin: 50px auto;
}

.title-container {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: v-bind(backgroundColor);
  border-bottom: solid 1px var(--dark-gray-color);
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

.title-text {
  font-size: 2rem;
  color: v-bind(textColor);
  font-weight: bold;
}

.content-container {
  margin: 20px;
  color: v-bind(textColor);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.content-text {
  font-size: 2rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .main-container {
    max-width: 50vw;
  }
}

@media (max-width: 700px) {
  .main-container {
    max-width: 80vw;
  }
}
</style>
