<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CryptoTable from '@/components/Crypto/CryptoTable.vue'
import StockTable from '@/components/Stock/StockTable.vue'
import { useWatchlistsStore } from '@/stores/watchlists'
import { useUserPreferencesStore } from '../stores/userPreferences';
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeWatchlists = useWatchlistsStore()
const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const watchlist = ref<string[]>([])
const selectedCategory = ref<'Crypto' | 'Stock'>('Crypto')

const loadWatchlist = async () => {
  await storeWatchlists.GetAllWatchlists(userId, selectedCategory.value, token)
  watchlist.value = storeWatchlists.watchlists.map(wl => wl.assetId)
}

onMounted(async () => {
  await loadWatchlist()
})
</script>

<template>
  <div class="main-container">
    <div class="title-container">
      <p class="title-text">{{ t('WatchlistTableView_Title') }}</p>
    </div>

		<div class="selection-container">
      <button 
        class="selection-btn"
				:class="{ selected: selectedCategory === 'Crypto' }"
        @click="selectedCategory = 'Crypto'; loadWatchlist()" 
      >
        {{ t('Header_Component_Cryptos') }}
      </button>
      <button 
				class="selection-btn"
				:class="{ selected: selectedCategory === 'Stock' }"
        @click="selectedCategory = 'Stock'; loadWatchlist()" 
      >
        {{ t('Header_Component_Stocks') }}
      </button>
    </div>

		<CryptoTable v-if="selectedCategory === 'Crypto'" :showWatchlist="true" :watchlist="watchlist" @refresh="loadWatchlist" />
		<StockTable v-if="selectedCategory === 'Stock'" :showWatchlist="true" :watchlist="watchlist" @refresh="loadWatchlist" />

		<div v-if="watchlist.length === 0 && selectedCategory === 'Crypto'">
      <p class="watchlist-message-text">
        {{ t('CryptoTable_Watchlist_Message') }}
      </p>
    </div>

    <div v-if="watchlist.length === 0 && selectedCategory === 'Stock'">
      <p class="watchlist-message-text">
        {{ t('StockTable_Watchlist_Message') }}
      </p>
    </div>
	</div>
</template>

<style scoped>
.main-container {
  max-width:97vw;
  margin: 0 auto;
	margin-bottom: 30px;
}

.title-container {
  margin: 50px 0;
}

.title-text {
  font-size: 2rem;
  color: v-bind(textColor);
  font-weight: bold;
}

.selection-container {
	margin: 0 0 30px 10px;
}

.selection-btn {
  font-size: 1.2rem;
  margin-right: 30px;
  color: var(--gray-color);
  font-weight: bold;
}

.selected {
  border-bottom: solid 2px var(--primary-color);
  border-radius: 2px;
  color: v-bind(textColor);
}

.watchlist-message-text {
  font-size: 1.2rem;
  color: v-bind(textColor);
  margin: 50px 0 0 10px;
}
</style>