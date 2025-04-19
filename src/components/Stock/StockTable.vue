<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router'
import { useStocksStore } from '@/stores/stocks'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const { t } = useI18n()

const storeStocks = useStocksStore()
const storeUserPreferences = useUserPreferencesStore()

const sortBy = ref<number | null>(null)
const order = ref(0)

const sortable = ref(false)
const route = useRoute()

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/stockTable') {
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
  storeStocks.GetAllStocks(sortBy.value, order.value)
}

const updateStockDatabase = async () => {
  await storeStocks.GetStock('aapl');

  if ((storeStocks.stock === null) || (new Date(storeStocks.stock.lastUpdated).toDateString() !== new Date().toDateString())) {
    await storeStocks.GetStocksApi();
    storeStocks.GetAllStocks(sortBy.value ?? 0, order.value) 
  }
};

updateStockDatabase();

storeStocks.GetAllStocks(sortBy.value ?? 0, order.value) 

window.scrollTo({ top: 0 });
</script>

<template>
  <div class="title-container">
    <p class="title-text">{{ t('StockTable_Title') }}</p>
  </div>
  <v-table class="table-container">
    <thead>
      <tr>
        <th></th>
        <th :style="{ width: sortable ? '70px' : '40px' }">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(1) : null">
            #
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 1">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-left column-fixed">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(2) : null">
            {{ t('StockTable_Name') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 2">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(3) : null">
            {{ t('StockTable_Price') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 3">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(4) : null">
            {{ t('StockTable_Change') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 4">{{ storeUserPreferences.getArrowDirectionReverse(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(5) : null">
            {{ t('StockTable_Change_Percentage') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 5">{{ storeUserPreferences.getArrowDirectionReverse(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(6) : null">
            {{ t('StockTable_Currency') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 6">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right" v-if="sortable">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(7) : null">
            {{ t('StockTable_Last_Dividend_Annual') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 7">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(0) : null">
            {{ t('StockTable_MarketCap') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 0">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(8) : null">
            {{ t('StockTable_Average_Volume') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 8">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span>
            {{ t('StockTable_Exchange') }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="stock in (sortable ? storeStocks.stocks : storeStocks.stocks.slice(0, 10))"
        :key="stock.id"
        class="stock-link"
        :class="storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'"
        @click="$router.push({ name: 'stockDetails', params: { id: stock.id } })"
        style="cursor: pointer"
      >
        <td>
          <span class="mdi mdi-star-outline"></span>
          <!-- <span class="mdi mdi-star"></span> -->
        </td>
        <td>
          <span>
            {{ stock.marketCapRank }}
          </span>
        </td>
        <td>
          <div class="stock-container">
            <img :src="stock.image" alt="Stock Logo" class="stock-image" :class="{ 'stock-image-light': storeUserPreferences.selectedTheme === 'light' }">
            <span class="stock-name">{{ stock.companyName }}</span>
            <span class="stock-symbol">{{ stock.symbol.toUpperCase() }}</span>
          </div>
        </td>
        <td class="text-right">
          {{ storeUserPreferences.convertPrice(stock.price, storeUserPreferences.selectedCurrency, 'after') }}
        </td>
        <td :style="{ color: storeUserPreferences.getPriceColor(stock.changes) }" class="text-right">
          {{ storeUserPreferences.convertPrice(stock.changes, storeUserPreferences.selectedCurrency, 'after') }}
        </td>
        <td :style="{ color: storeUserPreferences.getPriceColor(stock.changesPercentage) }" class="text-right">
          {{ stock.changesPercentage.toFixed(2) }}%
        </td>
        <td class="text-right">{{ stock.currency }}</td>
        <td class="text-right" v-if="sortable">
          {{ storeUserPreferences.convertPrice(stock.lastDiv, storeUserPreferences.selectedCurrency, 'after') }}
        </td>
        <td class="text-right">
          {{ storeUserPreferences.convertLargeNumber(stock.mktCap, storeUserPreferences.selectedCurrency, 'after') }}
        </td>
        <td class="text-right">
          {{ storeUserPreferences.convertLargeNumber(stock.volAvg, storeUserPreferences.selectedCurrency, 'after') }}
        </td>
        <td class="text-right">{{ stock.exchangeShortName }}</td>
      </tr>
    </tbody>
  </v-table>
  <div v-if="!sortable" class="stocks-see-all-container">
    <RouterLink 
      to="/stockTable" 
      class="stocks-see-all" 
      :style="'color: white'"
    >
      {{ t('AssetTable_See_All') }}
    </RouterLink>
  </div>
</template>

<style scoped>
.title-container {
  margin: 50px 0;
}

.title-text {
  font-size: 2rem;
  color: v-bind(textColor);
}

.table-container {
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
}

.column-fixed {
  width: 150px;
}

.v-table thead th {
  border-bottom: solid 1px #80808050 !important;
}

.v-table tbody td {
  border-bottom: solid 1px #80808050 !important;
  padding: 40px 16px !important; 
  font-size: 1.0rem !important;
}

.stock-link {
  text-decoration: none;
  color: inherit;
}

.hover-light:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.hover-dark:hover {
  background-color: #232323 !important;
}

.stock-container {
  display: flex;
  align-items: center;
}

.stock-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}

.stock-image-light {
  background-color: #0f0f0f38;
  border: solid 1px #0f0f0f38;
}

.stock-name {
  margin-right: 10px;
  padding-top: 2px;
  max-width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.stock-symbol {
  padding-top: 2px;
  font-size: 0.85rem;
  color: #808080;
}

.stocks-see-all-container {
  margin-top: 30px;
}

.stocks-see-all {
  font-size: 1.0rem;
  text-decoration: none;
  margin-left: 20px;
  color: v-bind(textColor) !important;
}

.stocks-see-all:hover {
  color: #FF8C00 !important;
}

</style>