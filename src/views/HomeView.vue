<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CryptoIndices from '@/components/CryptoIndices.vue'
import CryptosTrendingTable from '@/components/CryptosTrendingTable.vue'
import StocksTrendingTable from '@/components/StocksTrendingTable.vue'
import CryptoTable from '@/components/CryptoTable.vue'
import StockTable from '@/components/StockTable.vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'

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
      <CryptosTrendingTable class="content-item"></CryptosTrendingTable>
      <StocksTrendingTable class="content-item"></StocksTrendingTable>
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

</style>
