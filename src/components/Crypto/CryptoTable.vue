<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router'
import { useCryptosStore } from '@/stores/cryptos'
import { useWatchlistsStore } from '@/stores/watchlists'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import CryptoSparkline from '../Crypto/CryptoSparkline.vue'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const { t } = useI18n()

const storeCryptos = useCryptosStore()
const storeWatchlists = useWatchlistsStore()
const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

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
    } else if (newPath === '/cryptoTable') {
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

const cryptosList = computed(() => {
  if (props.showWatchlist) {
    return storeCryptos.cryptos.filter(crypto => props.watchlist?.includes(crypto.id))
  }
  return sortable.value ? storeCryptos.cryptos : storeCryptos.cryptos.slice(0, 10)
})

const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const watchlist = ref<string[]>([])

async function loadWatchlist() {
  if (!storeAuth.isLoggedIn()) return;
  await storeWatchlists.GetAllWatchlists(userId, 'Crypto', token)
  watchlist.value = storeWatchlists.watchlists.map(wl => wl.assetId)
}

async function toggleFavorite(cryptoId: string) {

  const isFav = watchlist.value.includes(cryptoId)

  if (isFav) {
    const success = await storeWatchlists.DeleteWatchlist(userId, cryptoId, 'Crypto', token)
    if (success) {
      watchlist.value = watchlist.value.filter(id => id !== cryptoId)
      emit('refresh')
    }
  } else {
    const success = await storeWatchlists.CreateWatchlist(userId, cryptoId, 'Crypto', token)
    if (success) {
      watchlist.value.push(cryptoId)
      emit('refresh')
    }
  }
}

onMounted(async () => {
  await loadWatchlist()
  await storeCryptos.GetAllCryptos(sortBy.value ?? 0, order.value)
  window.scrollTo({ top: 0 });
})
</script>

<template>
  <div v-if="!props.showWatchlist" class="title-container">
    <p class="title-text">{{ t('CryptoTable_Title') }}</p>
  </div>

  <v-table v-if="cryptosList.length != 0" class="table-container">
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
            {{ t('CryptoTable_Name') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 2">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(3) : null">
            {{ t('CryptoTable_Price') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 3">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(4) : null">
            {{ t('CryptoTable_1h') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 4">{{ storeUserPreferences.getArrowDirectionReverse(order) }}</v-icon>
        </th> 
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(5) : null">
            {{ t('CryptoTable_24h') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 5">{{ storeUserPreferences.getArrowDirectionReverse(order) }}</v-icon>
        </th> 
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(6) : null">
            {{ t('CryptoTable_7d') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 6">{{ storeUserPreferences.getArrowDirectionReverse(order) }}</v-icon>
        </th> 
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(0) : null">
            {{ t('CryptoTable_MarketCap') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 0">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th>
        <th class="text-right">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(7) : null">
            {{ t('CryptoTable_Volume_24h') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 7">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th> 
        <th class="text-right" v-if="sortable">
          <span :class="{'cursor-pointer': sortable}" @click="sortable ? toggleSort(8) : null">
            {{ t('CryptoTable_Circulating_Supply') }}
          </span>
          <v-icon v-if="sortBy !== null && sortBy === 8">{{ storeUserPreferences.getArrowDirection(order) }}</v-icon>
        </th> 
        <th class="text-right">
          <span>{{ t('CryptoTable_Last_7_Days') }}</span>
        </th> 
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="crypto in cryptosList"        
        :key="crypto.id"
        :class="storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'"
        @click="$router.push({ name: 'cryptoDetails', params: { id: crypto.id } })"
        style="cursor: pointer"
      >
          <td>
            <span v-if="storeAuth.isLoggedIn()" @click.stop="toggleFavorite(crypto.id)" class="favorite-icon">
              <span v-if="watchlist.includes(crypto.id)" class="mdi mdi-star favorite-icon-active"></span>
              <span v-else class="mdi mdi-star-outline"></span>
            </span>
          </td>
          <td>
            <span>
              {{ crypto.marketCapRank }}
            </span>
          </td>
          <td>
            <div class="crypto-container">
              <img :src="crypto.image" alt="Crypto Logo" class="crypto-image" @error="storeUserPreferences.showDefaultAssetImage(crypto)" />
              <span class="crypto-name">{{ crypto.name }}</span>
              <span class="crypto-symbol">{{ crypto.symbol.toUpperCase() }}</span>
            </div>
          </td>
          <td class="text-right">
            {{ storeUserPreferences.convertPrice(crypto.current_price, storeUserPreferences.selectedCurrency, 'after') }}
          </td>
          <td :style="{ color: storeUserPreferences.getPriceColor(crypto.price_change_percentage_1h_in_currency) }" class="text-right">
            <v-icon class="mb-1">
              {{ storeUserPreferences.getArrowDirection(crypto.price_change_percentage_1h_in_currency) }}
            </v-icon>
            {{ Math.abs(crypto.price_change_percentage_1h_in_currency).toFixed(2) }}%
          </td>
          <td :style="{ color: storeUserPreferences.getPriceColor(crypto.price_change_percentage_24h) }" class="text-right">
            <v-icon class="mb-1">
              {{ storeUserPreferences.getArrowDirection(crypto.price_change_percentage_24h) }}
            </v-icon>
            {{ Math.abs(crypto.price_change_percentage_24h).toFixed(2) }}%
          </td>
          <td :style="{ color: storeUserPreferences.getPriceColor(crypto.price_change_percentage_7d_in_currency) }" class="text-right">
            <v-icon class="mb-1">
              {{ storeUserPreferences.getArrowDirection(crypto.price_change_percentage_7d_in_currency) }}
            </v-icon>
            {{ Math.abs(crypto.price_change_percentage_7d_in_currency).toFixed(2) }}%
          </td>
          <td class="text-right">
            {{ storeUserPreferences.convertLargeNumber(crypto.market_cap, storeUserPreferences.selectedCurrency, 'after') }}
          </td>
          <td class="text-right">
            {{ storeUserPreferences.convertLargeNumber(crypto.total_volume, storeUserPreferences.selectedCurrency, 'after') }}
          </td>
          <td class="text-right" v-if="sortable">
            {{ storeUserPreferences.convertLargeNumber(crypto.circulating_supply, storeUserPreferences.selectedCurrency, 'after') }}
          </td>
          <td class="text-right">
            <CryptoSparkline v-if="crypto.sparkline_in_7d?.price?.length" :prices="crypto.sparkline_in_7d.price" />
          </td>
      </tr>
    </tbody>
  </v-table>
  <div v-if="!sortable && !props.showWatchlist" class="cryptos-see-all-container">
    <RouterLink 
      to="/cryptoTable" 
      class="cryptos-see-all" 
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
  border-bottom: solid 1px #80808050 !important;
}

.v-table tbody td {
  border-bottom: solid 1px #80808050 !important;
  padding: 25px 16px !important; 
  font-size: 1.0rem !important;
}

.hover-light:hover {
  background-color: #ced1d3 !important;
}

.hover-dark:hover {
  background-color: #232323 !important;
}

.favorite-icon-active {
  color: gold;
}

.favorite-icon {
  color: v-bind(textColor);
}

.favorite-icon:hover {
  color: gold;
}

.crypto-container {
  display: flex;
  align-items: center;
}

.crypto-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}

.crypto-name {
  margin-right: 10px;
  padding-top: 2px;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
}

.crypto-symbol {
  padding-top: 2px;
  font-size: 0.85rem;
  color: #808080;
  white-space: nowrap;
  font-weight: bold;
}

.cryptos-see-all-container {
  margin-top: 30px;
}

.cryptos-see-all {
  font-size: 1.0rem;
  text-decoration: none;
  margin-left: 20px;
  color: v-bind(textColor) !important;
}

.cryptos-see-all:hover {
  color: #FF8C00 !important;
}

</style>