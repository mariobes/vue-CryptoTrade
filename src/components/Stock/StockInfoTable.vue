<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import { useWatchlistsStore } from '@/stores/watchlists'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)

const storeStocks = useStocksStore()
const storeWatchlists = useWatchlistsStore()
const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const props = defineProps<{ stockId: string }>()

const stock = computed(() => storeStocks.stock)

watch(
  () => props.stockId,
  async (id) => {
    if (id) {
      await storeStocks.GetStock(id)
    }
  },
  { immediate: true }
)

const stockAmount = ref(1)
const fiatAmount = ref(0)

const stockPrice = computed(() =>
  stock.value?.price ? Number(stock.value.price) : NaN
)

const convertToFiat = () => {
  const converted = storeUserPreferences.getConvertedPrice(stockPrice.value, storeUserPreferences.selectedCurrency)
  if (!isNaN(converted)) {
    fiatAmount.value = stockAmount.value * converted
  }
}

const convertToStock = () => {
  const converted = storeUserPreferences.getConvertedPrice(stockPrice.value, storeUserPreferences.selectedCurrency)
  if (converted) {
    stockAmount.value = fiatAmount.value / converted
  }
}

watch(
  () => storeUserPreferences.selectedCurrency,
  () => {
    convertToFiat()
    convertToStock()
  }
)

watch(stock, (newVal) => {
  if (newVal) convertToFiat()
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
    }
  } else {
    const success = await storeWatchlists.CreateWatchlist(userId, stockId, 'Stock', token)
    if (success) {
      watchlist.value.push(stockId)
    }
  }
}

onMounted(() => {
  loadWatchlist()
	window.scrollTo({ top: 0 })
})
</script>

<template>
	<div class="main-container" v-if="stock">
		<div>

				<div class="stock-content-name">
					<img :src="stock.image" alt="Stock Logo" 
						class="stock-image" 
						:class="{ 'stock-image-light': storeUserPreferences.selectedTheme === 'light' }"
						@error="storeUserPreferences.showDefaultAssetImage(stock)" 
					/>
					<span class="stock-name">{{ stock.companyName }}</span>
					<span class="stock-symbol mt-1">{{ stock.symbol.toUpperCase() }}</span>
					<span class="stock-rank" :style="{ backgroundColor: storeUserPreferences.selectedTheme === 'light' ? '#f0eded' : '#313030' }">
						#{{ stock.marketCapRank }}
					</span>
				</div>
				<div class="stock-content-price-favorite">
					<div class="stock-content-price">
						<span class="stock-price">{{ storeUserPreferences.convertPrice(stock.price, storeUserPreferences.selectedCurrency, 'after') }}</span>
						<span class="stock-percentage" :style="{ color: storeUserPreferences.getPriceColor(stock.changesPercentage) }">
							<v-icon class="mb-1">
								{{ storeUserPreferences.getArrowDirection(stock.changesPercentage) }}
							</v-icon>
							{{ Math.abs(stock.changesPercentage).toFixed(2) }}% (1D)
						</span>
					</div>
					<div class="stock-content-favorite">
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
				</div>
				</div>
		</div>

		<div class="stock-content-cap">
			<div class="stock-container-cap stock-cap">
				<span class="stock-content-title">{{ t('StockInfoTable_MarketCap') }}</span>
				<span class="stock-content-value">{{ storeUserPreferences.convertToAbbreviated(stock.mktCap, storeUserPreferences.selectedCurrency, 'after') }}</span>
			</div>

			<div class="stock-container-cap">
				<span class="stock-content-title">{{ t('StockInfoTable_Changes') }}</span>
				<span class="stock-content-value" :style="{ color: storeUserPreferences.getPriceColor(stock.changes) }">
					{{ stock.changes ? '+' : '-' }}{{ storeUserPreferences.convertPrice(Math.abs(stock.changes), storeUserPreferences.selectedCurrency, 'after') }}
				</span>
			</div>

			<div class="stock-container-cap">
				<span class="stock-content-title">{{ t('StockInfoTable_Volume') }}</span>
				<span class="stock-content-value">{{ storeUserPreferences.convertToAbbreviated(stock.volAvg, storeUserPreferences.selectedCurrency, 'after') }}</span>
			</div>

			<div class="stock-container-cap">
				<span class="stock-content-title">{{ t('StockInfoTable_Last_Dividend') }}</span>
				<span class="stock-content-value">{{ storeUserPreferences.convertPrice(stock.lastDiv, storeUserPreferences.selectedCurrency, 'after') }}</span>
			</div>

			<div class="stock-container-cap">
				<span class="stock-content-title">{{ t('StockInfoTable_Country') }}</span>
				<span class="stock-content-value">{{ stock.country }}</span>
			</div>

			<div class="stock-container-cap">
				<span class="stock-content-title">{{ t('StockInfoTable_Currency') }}</span>
				<span class="stock-content-value">{{ stock.currency }}</span>
			</div>

			<div class="stock-container-cap">
				<span class="stock-content-title">{{ t('StockInfoTable_Exchange') }}</span>
				<span class="stock-content-value">{{ stock.exchangeShortName + ' | ' + stock.exchange }}</span>
			</div>

		</div>

		<div class="stock-content-info">
			<div class="stock-info-item">
				<span class="info-item-text">{{ t('StockInfoTable_Website') }}</span>
				<span>
					<a :href="stock.website" target="_blank" class="stock-link">
						<span class="mdi mdi-web pr-1"></span>
						<span>Website</span>
					</a>
				</span>
			</div>

			<div class="stock-info-item">
				<span class="info-item-text">{{ t('StockInfoTable_Sector') }}</span>
				<span class="info-item-value">{{ stock.sector }}</span>
			</div class="stock-info-item">

			<div class="stock-info-item">
				<span class="info-item-text">{{ t('StockInfoTable_Industry') }}</span>
				<span class="info-item-value">{{ stock.industry }}</span>
			</div>

			<div class="stock-info-item">
				<span class="info-item-text">{{ t('StockInfoTable_Isin') }}</span>
				<span class="info-item-value">{{ stock.isin }}</span>
			</div>

			<div class="stock-info-item">
				<span class="info-item-text">{{ t('StockInfoTable_Ceo') }}</span>
				<span class="info-item-value">{{ stock.ceo }}</span>
			</div>
		</div>

		<div class="converter-container">
			<div class="converter-title">
				{{ t('StockInfoTable_Converter_1') }} 
				{{ stock.symbol.toLocaleUpperCase() }} 
				{{ t('StockInfoTable_Converter_2') }} 
				{{ storeUserPreferences.selectedCurrency }}
			</div>
			<div class="converter-content">
				<div class="converter-stock">
					<label class="converter-text">{{ stock.symbol.toUpperCase() }}</label>
					<input
						class="converter-value"
						v-model.number="stockAmount"
						@input="convertToFiat"
						placeholder="0"
					/>
				</div>
				<hr class="bar-divisor">
				<div class="converter-currency">
					<label class="converter-text">{{ storeUserPreferences.selectedCurrency }}</label>
					<input
						class="converter-value"
						v-model.number="fiatAmount"
						@input="convertToStock"
						placeholder="0"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
	padding: 25px;
}

.stock-content-name {
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
	font-size: 1.6rem;
	font-weight: bold;
  white-space: wrap;
}

.stock-symbol {
	font-size: 1.2rem;
	font-weight: bold;
	color: #808080;
}

.stock-rank {
	color: #808080;
	padding: 0 3px;
	border-radius: 5px;
	margin-left: 5px;
	font-size: 0.85rem;
	font-weight: bold;
}

.stock-content-price-favorite {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.stock-content-price {
	display: flex;
	margin-top: 5px;
}

.favorite-icon-active {
  color: gold;
}

.favorite-icon {
  color: v-bind(textColor);
	cursor: pointer;
	font-size: 1.6rem;
	margin-right: 15px;
}

.favorite-icon:hover {
  color: gold;
}

.stock-price {
	font-size: 2.5rem;
	font-weight: bold;
	margin-right: 10px;
	white-space: nowrap;
}

.stock-percentage {
	font-size: 1rem;
	display: flex;
	font-weight: bold;
	align-items: center;
	white-space: nowrap;
}

.stock-content-cap {
  display: flex;
  flex-wrap: wrap;
	margin: 20px 0;
}

.stock-container-cap {
  flex: 1 1 calc(50% - 10px);
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-radius: 10px;
	border: solid 1px #80808050;
	margin: 5px;
	display: flex;
	flex-direction: column;
}

.stock-content-title {
	color: #808080;
	font-size: 0.8rem;
}

.stock-content-value {
	font-size: 1rem;
}

.stock-content-percentage {
	font-size: 0.9rem;
}

.stock-content-percentage-icon {
	font-size: 1.1rem;
	margin-bottom: 2px;
	margin-left: 5px;
}

.stock-content-info {
	display: flex;
	flex-direction: column;
	gap: 25px;
	margin: 20px 0 45px 0;
}

.stock-info-item {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.info-item-text {
	color: #808080;
}

.info-item-value {
	font-weight: bold;
}

a {
  text-decoration: none;
  color: v-bind(textColor);
}

.stock-link {
	background-color: v-bind(colorGray);
	border-radius: 20px;
	padding: 5px;
	font-size: 0.8rem;
	margin: 0 3px;
}

.stock-link:hover {
	background-color: #FF8C00;
}

.converter-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
  border: solid 3px #80808050;
  border-radius: 10px;
}

.converter-stock {
  display: flex;
  justify-content: space-between;
	padding: 10px 0 0 10px;
}

.converter-currency {
  display: flex;
  justify-content: space-between;
	padding: 0 0 10px 10px;
}

.converter-text {
	color: #808080;
	font-weight: bold;
}

.converter-value {
  text-align: right;
  width: 60%;
	color: v-bind(textColor);
}

.converter-value {
  text-align: right;
  width: 60%;
	padding-right: 10px;
}

.converter-value:focus {
  outline: none;
  border: none;
}

.bar-divisor {
  height: 1px;
  background-color: #80808050;
  border: none;
}
</style>