<script setup lang="ts">
import { computed } from 'vue'
import CryptoIndices from '@/components/Crypto/CryptoIndices.vue'
import CryptosTrendingTable from '@/components/Crypto/CryptosTrendingTable.vue'
import StocksTrendingTable from '@/components/Stock/StocksTrendingTable.vue'
import CryptoTable from '@/components/Crypto/CryptoTable.vue'
import StockTable from '@/components/Stock/StockTable.vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()
</script>

<template>
  <div class="main-container">
    <div class="title-container">
      <p class="title-text">{{ t('HomeView_Title') }}</p>
    </div>
    <div class="content-container"> 
      <CryptoIndices class="content-item"></CryptoIndices>
      <CryptosTrendingTable class="content-item crypto-trending"></CryptosTrendingTable>
      <StocksTrendingTable class="content-item stock-trending"></StocksTrendingTable>
    </div>

    <CryptoTable></CryptoTable>
    <StockTable></StockTable>
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
  font-family: 'Montserrat', sans-serif;
}

.content-container {
  display: flex;
}

.content-item {
  width: 100%;
}

.content-item:not(:last-child) {
  margin-right:30px;
}

/* Responsive */
@media (max-width: 1400px) {
  .main-container {
    max-width: 90vw;
  }
}

@media (max-width: 1250px) {
  .stock-trending {
    display: none;
  }
}

@media (max-width: 775px) {
  .crypto-trending {
    display: none;
  }
}
</style>
