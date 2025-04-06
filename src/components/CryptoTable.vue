<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'
import CryptoSparkline from '../components/CryptoSparkline.vue'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const { t } = useI18n()

const storeCryptos = useCryptosStore()
const storeUserPreferences = useUserPreferencesStore()

const sortBy = ref<number | null>(null)
const order = ref(0)

const sortable = ref(false)
const route = useRoute()

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/CryptoTable') {
      sortable.value = true
    } else if (newPath === '/') {
      sortable.value = false
    }
  },
  { immediate: true }
)

const toggleSort = (newSortBy: number) => {
  if (!sortable) return;

  if (sortBy.value === newSortBy) {
    order.value = order.value === 0 ? 1 : 0;
  } else {
    sortBy.value = newSortBy;
    order.value = 1;
  }
  storeCryptos.GetAllCryptos(sortBy.value, order.value)
}

const updateCryptoDatabase = async () => {
  await storeCryptos.GetCrypto('bitcoin');

  if (storeCryptos.crypto && new Date(storeCryptos.crypto.lastUpdated).toDateString() !== new Date().toDateString()) {
    await storeCryptos.GetCryptosApi();
  }
};

updateCryptoDatabase();

storeCryptos.GetAllCryptos(sortBy.value ?? 0, order.value)

const getConvertedPrice = (price: number): string => {
  return storeUserPreferences.convertFromUSD(price, storeUserPreferences.selectedCurrency)
}

const getConvertedMarketCap = (marketCap: number): string => {
  const rate = storeUserPreferences.getCurrencyConversionRate(storeUserPreferences.selectedCurrency);
  const symbol = storeUserPreferences.getCurrencySymbol(storeUserPreferences.selectedCurrency);
  const convertedValue = marketCap * rate;

  return `${formatMarketCap(convertedValue)} ${symbol}`;
};

const formatMarketCap = (marketCap: number): string => {
  return marketCap.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

</script>

<template>
  <div class="title-container">
    <p class="title-text">{{ t('CryptoTable_Title') }}</p>
  </div>
  <v-table class="table-container">
    <thead>
      <tr>
        <th class="number-column"></th>
        <th class="number-column">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(1) : null">
            #
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 1">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th>
        <th class="text-left column-fixed">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(2) : null">
            {{ t('CryptoTable_Name') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 2">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th>
        <th class="text-right crypto-column">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(3) : null">
            {{ t('CryptoTable_Price') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 3">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(4) : null">
            {{ t('CryptoTable_1h') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 4">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th> 
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(5) : null">
            {{ t('CryptoTable_24h') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 5">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th> 
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(6) : null">
            {{ t('CryptoTable_7d') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 6">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th> 
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(0) : null">
            {{ t('CryptoTable_MarketCap') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 0">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(7) : null">
            {{ t('CryptoTable_Volume_24h') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 7">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th> 
        <th class="text-right" v-if="sortable">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(8) : null">
            {{ t('CryptoTable_Circulating_Supply') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 8">{{ order === 0 ? 'mdi-menu-up' : 'mdi-menu-down' }}</v-icon>
        </th> 
        <th class="text-right">
          <span>{{ t('CryptoTable_Last_7_Days') }}</span>
        </th> 
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="crypto in storeCryptos.cryptos.slice(0, 10)"
        :key="crypto.id"
      >
        <td>
          <span class="mdi mdi-star-outline"></span>
          <!-- <span class="mdi mdi-star"></span> -->
        </td>
        <td>
          <span>
            {{ crypto.marketCapRank }}
          </span>
        </td>
        <td>
          <div class="crypto-container">
            <img :src="crypto.image" alt="crypto.image" class="crypto-image"/>
            <span class="crypto-name">{{ crypto.name }}</span>
            <span class="crypto-symbol">{{ crypto.symbol.toUpperCase() }}</span>
          </div>
        </td>
        <td class="crypto-column">{{ getConvertedPrice(crypto.current_price) }}</td>
        <td :style="{ color: crypto.price_change_percentage_7d_in_currency < 0 ? 'red' : 'green' }" class="crypto-column">
          {{ crypto.price_change_percentage_1h_in_currency.toFixed(2) }}%
        </td>
        <td :style="{ color: crypto.price_change_percentage_7d_in_currency < 0 ? 'red' : 'green' }" class="crypto-column">
          {{ crypto.price_change_percentage_24h.toFixed(2) }}%
        </td>
        <td :style="{ color: crypto.price_change_percentage_7d_in_currency < 0 ? 'red' : 'green' }" class="crypto-column">
          {{ crypto.price_change_percentage_7d_in_currency.toFixed(2) }}%
        </td>
        <td class="crypto-column">{{ getConvertedMarketCap(crypto.market_cap) }}</td>
        <td class="crypto-column">{{ getConvertedMarketCap(crypto.total_volume) }}</td>
        <td class="crypto-column" v-if="sortable">{{ getConvertedMarketCap(crypto.circulating_supply) }}</td>
        <td class="crypto-column">
          <CryptoSparkline v-if="crypto.sparkline_in_7d?.price?.length" :prices="crypto.sparkline_in_7d.price" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.title-container {
  margin: 50px 0;
}

.title-text {
  font-size: 2rem;
  color: white;
}

.table-container {
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
}

.column-fixed {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-table thead th {
  border-bottom: solid 1px #80808050 !important;
}

.v-table tbody td {
  border-bottom: solid 1px #80808050 !important;
  padding: 25px 16px !important; 
  font-size: 16px !important;
}

.number-column {
  width: 40px;
}

.crypto-container {
  display: flex;
  align-items: center;
}

.crypto-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  align-items: center;
  border-radius: 50%;
}

.crypto-name {
  margin-right: 5px;
  padding-top: 2px;
}

.crypto-symbol {
  margin-right: 5px;
  padding-top: 2px;
  font-size: 14px;
  color: #808080;
}

.crypto-column {
  width: 80px;
  text-align: right;
}

.crypto-name {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
}

</style>