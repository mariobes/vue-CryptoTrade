<script setup lang="ts">
import { computed, onMounted } from 'vue'
import CryptoIndices from '@/components/Crypto/CryptoIndices.vue'
import CryptosTrendingTable from '@/components/Crypto/CryptosTrendingTable.vue'
import StocksTrendingTable from '@/components/Stock/StocksTrendingTable.vue'
import CryptoTable from '@/components/Crypto/CryptoTable.vue'
import StockTable from '@/components/Stock/StockTable.vue'
import { useCryptosStore } from '@/stores/cryptos'
import { useStocksStore } from '@/stores/stocks'
import { useMarketsStore } from '@/stores/markets'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeCryptos = useCryptosStore()
const storeStocks = useStocksStore()
const storeMarkets = useMarketsStore()
const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const updateAssetsDatabase = async () => {
  await storeCryptos.GetAllCryptos(0, 0)
  await storeStocks.GetAllStocks(0, 0)
  const firstCrypto = storeCryptos.cryptos[0];
  const firstStock =  storeStocks.stocks[0];

  if ((firstCrypto?.lastUpdated == null || new Date(firstCrypto.lastUpdated).toDateString() !== new Date().toDateString()) &&
     (firstStock?.lastUpdated == null || new Date(firstStock.lastUpdated).toDateString() !== new Date().toDateString())) 
  {
    await storeMarkets.GetTotalMarketCapApi();
    await storeMarkets.GetFearGreedIndexApi();
    await storeMarkets.GetCMC100IndexApi();
    await storeMarkets.GetCryptoIndices()

    await storeMarkets.GetCryptosTrendingApi();
    await storeMarkets.GetCryptosTrending()

    await storeMarkets.GetStocksTrendingApi();
    await storeMarkets.GetStocksTrending()

    await storeMarkets.GetStocksGainersApi();

    await storeMarkets.GetStocksLosersApi();

    await storeMarkets.GetStocksMostActivesApi();

    await storeCryptos.GetCryptosApi();
    await storeCryptos.GetAllCryptos(0, 0)

    await storeStocks.GetStocksApi();
    await storeStocks.GetAllStocks(0, 0)
  }
};

onMounted(async () => {
  await updateAssetsDatabase();
});
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
  font-weight: bold;
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
