<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router'
import { useStocksStore } from '@/stores/stocks'
import { useWatchlistsStore } from '@/stores/watchlists'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeStocks = useStocksStore()
const storeWatchlists = useWatchlistsStore()
const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const sortBy = ref<number | null>(null)
const order = ref(0)

const sortable = ref(false)
const route = useRoute()

const props = defineProps<{
  showWatchlist?: boolean,
  watchlist?: string[]
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

watch(
  () => route.path,
  (newPath) => {
    if (props.showWatchlist) {
      sortable.value = true
    } else if (newPath === '/stockTable') {
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

const stocksList = computed(() => {
  if (props.showWatchlist) {
    return storeStocks.stocks.filter(stock => props.watchlist?.includes(stock.id))
  }
  return sortable.value ? storeStocks.stocks : storeStocks.stocks.slice(0, 10)
})

const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const watchlist = ref<string[]>([])

async function loadWatchlist() {
  if (!storeAuth.isLoggedIn()) return;
  await storeWatchlists.GetAllWatchlists(userId, 'Stock', token)
  watchlist.value = storeWatchlists.watchlists.map(wl => wl.assetId)
}

async function toggleFavorite(stockId: string) {

  const isFav = watchlist.value.includes(stockId)

  if (isFav) {
    const success = await storeWatchlists.DeleteWatchlist(userId, stockId, 'Stock', token)
    if (success) {
      watchlist.value = watchlist.value.filter(id => id !== stockId)
      emit('refresh')
    }
  } else {
    const success = await storeWatchlists.CreateWatchlist(userId, stockId, 'Stock', token)
    if (success) {
      watchlist.value.push(stockId)
      emit('refresh')
    }
  }
}

onMounted(async () => {
  await loadWatchlist()
  storeStocks.GetAllStocks(sortBy.value ?? 0, order.value) 
  window.scrollTo({ top: 0 });
})
</script>

<template>
  <div v-if="!props.showWatchlist" class="title-container">
    <p class="title-text">{{ t('StockTable_Title') }}</p>
  </div>

  <v-table v-if="stocksList.length != 0" class="table-container">
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
        v-for="stock in stocksList"        
        :key="stock.id"
        :class="storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'"
        @click="$router.push({ name: 'stockDetails', params: { id: stock.id } })"
        style="cursor: pointer"
      >
        <td>
          <span v-if="storeAuth.isLoggedIn()" @click.stop="toggleFavorite(stock.id)" class="favorite-icon">
            <span 
              v-if="watchlist.includes(stock.id)" 
              class="mdi mdi-star favorite-icon-active"
            ></span>
            <span 
              v-else 
              class="mdi mdi-star-outline"
            ></span>
          </span>
        </td>
        <td>
          <span>
            {{ stock.marketCapRank }}
          </span>
        </td>
        <td>
          <div class="stock-container">
            <img :src="stock.image" alt="Stock Logo"
                @error="storeUserPreferences.showDefaultAssetImage(stock)"
                class="stock-image" 
                :class="{ 'stock-image-light': storeUserPreferences.selectedTheme === 'light' }"
            />
            <span class="stock-name">{{ stock.companyName }}</span>
            <span class="stock-symbol">{{ stock.symbol.toUpperCase() }}</span>
          </div>
        </td>
        <td class="text-right">
          {{ storeUserPreferences.convertPrice(stock.price, storeUserPreferences.selectedCurrency, 'after') }}
        </td>
        <td :style="{ color: storeUserPreferences.getPriceColor(stock.changes) }" class="text-right">
          <v-icon class="mb-1">
            {{ storeUserPreferences.getArrowDirection(stock.changes) }}
          </v-icon>
          {{ storeUserPreferences.convertPrice(Math.abs(stock.changes), storeUserPreferences.selectedCurrency, 'after') }}
        </td>
        <td :style="{ color: storeUserPreferences.getPriceColor(stock.changesPercentage) }" class="text-right">
          <v-icon class="mb-1">
            {{ storeUserPreferences.getArrowDirection(stock.changesPercentage) }}
          </v-icon>
          {{ Math.abs(stock.changesPercentage).toFixed(2) }}%
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

  <div v-if="!sortable && !props.showWatchlist" class="stocks-see-all-container">
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
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}

.table-container {
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
  margin-bottom: 30px;
}

.column-fixed {
  width: 150px;
}

.v-table thead th {
  border-bottom: solid 1px var(--dark-gray-color) !important;
}

.v-table tbody td {
  border-bottom: solid 1px var(--dark-gray-color) !important;
  padding: 40px 16px !important; 
  font-size: 1.0rem !important;
}

.hover-light:hover {
  background-color: var(--table-color-hover-light) !important;
}

.hover-dark:hover {
  background-color: var(--table-color-hover-dark) !important;
}

.favorite-icon-active {
  color: var(--gold-color);
}

.favorite-icon {
  color: v-bind(textColor);
}

.favorite-icon:hover {
  color: var(--gold-color);
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
  background-color: var(--background-stock-image);
  border: solid 1px var(--background-stock-image);
}

.stock-name {
  margin-right: 10px;
  padding-top: 2px;
  max-width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
}

.stock-symbol {
  padding-top: 2px;
  font-size: 0.85rem;
  color: var(--gray-color);
  white-space: nowrap;
  font-weight: bold;
}

.stocks-see-all-container {
  margin: 30px 0;
}

.stocks-see-all {
  font-size: 1.0rem;
  text-decoration: none;
  margin-left: 20px;
  color: v-bind(textColor) !important;
}

.stocks-see-all:hover {
  color: var(--primary-color) !important;
}
</style>