<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCryptosStore } from '../../stores/cryptos';
import { useStocksStore } from '../../stores/stocks';
import { useUserPreferencesStore } from '@/stores/userPreferences'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)

const storeCryptos = useCryptosStore()
const storeStocks = useStocksStore()
const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const cryptoResults = ref<any[]>([])
const stockResults = ref<any[]>([])
const showAllCryptos = ref(false)
const showAllStocks = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const cryptoScrollContainer = ref<HTMLElement | null>(null)
const stockScrollContainer = ref<HTMLElement | null>(null)

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const searchDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

watch(searchQuery, async (newQuery) => {
  const trimmedQuery = newQuery.trim()

  cryptoResults.value = []
  stockResults.value = []
	showAllCryptos.value = false
	showAllStocks.value = false

  if (trimmedQuery) {
    const [cryptos, stocks] = await Promise.all([
      storeCryptos.SearchCrypto(trimmedQuery),
      storeStocks.SearchStock(trimmedQuery)
    ])

    if (searchQuery.value.trim() === trimmedQuery) {
			cryptoResults.value = cryptos ?? []
			stockResults.value = stocks ?? []
    }
  }
})

storeCryptos.GetAllCryptos(0, 0) 
storeStocks.GetAllStocks(0, 0) 

let savedCryptoScrollTop = 0;
let savedStockScrollTop = 0;

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    const containerCrypto = cryptoScrollContainer.value
		const containerStock = stockScrollContainer.value
    if (containerCrypto) savedCryptoScrollTop = containerCrypto.scrollTop
    if (containerStock) savedStockScrollTop = containerStock.scrollTop
  } else {
    nextTick(() => {
      const containerCrypto = cryptoScrollContainer.value
			const containerStock = stockScrollContainer.value
      if (containerCrypto) containerCrypto.scrollTop = savedCryptoScrollTop
			if (containerStock) containerStock.scrollTop = savedStockScrollTop
    })
		nextTick(() => {
			const inputEl = searchInput.value
			if (inputEl) {
				inputEl.focus()
				if (searchQuery.value.trim()) {
					inputEl.select()
				}
			}
		})
  }
})

const goToCrypto = (id: string) => {
  router.push({ name: 'cryptoDetails', params: { id } })
  searchDialog.value = false
}

const goToStock = (id: string) => {
  router.push({ name: 'stockDetails', params: { id } })
  searchDialog.value = false
}
</script>

<template>
	<v-dialog v-model="searchDialog" class="search-container">
		<v-card rounded="lg" :style="{ backgroundColor: backgroundTable, color: textColor }">
			<div class="popup-content">
				<v-card-text>
					<v-text-field
						ref="searchInput"
						class="popup-search"
						v-model="searchQuery"
						:placeholder="t('Header_Search_Text')"
						prepend-inner-icon="mdi-magnify"
						variant="solo"
						hide-details
						rounded="lg"
						flat
						:bg-color="storeUserPreferences.selectedTheme === 'light' ? '#e9ecef' : '#232323'"
					/>
					<v-btn 
						icon 
						@click="searchDialog = false" 
						class="popup-close-btn" 
						:style="{ color: textColor }"
						:ripple="false"
						density="compact"
					>
						<v-icon size="25">mdi-close</v-icon>
					</v-btn>
				</v-card-text>

				<!-- Sección de resultados de criptomonedas -->
				<div class="popup-results">
					<p class="popup-title">
						{{ t('Header_Component_Cryptos') }}
					</p>
					<div v-if="cryptoResults.length === 0 && searchQuery.trim() !== ''" class="popup-no-results-text">
						{{ t('Header_Search_No_Results') }}
					</div>
					<div ref="cryptoScrollContainer" class="popup-results-content">
						<button
							v-for="crypto in (searchQuery.trim() === '' ? storeCryptos.cryptos.slice(0, 5) : (showAllCryptos ? cryptoResults : cryptoResults.slice(0, 5)))"
							:key="crypto.id"
							@click="goToCrypto(crypto.id)"
							class="popup-results-btn"
							:style="{ backgroundColor: storeUserPreferences.selectedTheme === 'light' ? '#e9ecef' : '#363535' }"
						>
							<div class="popup-results-asset">
								<img :src="crypto.image" alt="asset Image" class="popup-asset-image" @error="storeUserPreferences.showDefaultAssetImage(crypto)" />
								<div class="popup-results-asset-name">
									<div class="popup-results-asset-name-rank">
										<span class="popup-asset-name">
											{{ crypto.name }} 
										</span>
										<span class="popup-asset-rank" :style="{ backgroundColor: storeUserPreferences.selectedTheme === 'light' ? 'var(--asset-rank-background-light)' : 'var(--asset-rank-background-dark)' }">
											#{{ crypto.marketCapRank }}
										</span>
									</div>
									<span class="popup-asset-symbol">
										{{ crypto.symbol.toUpperCase() }}
									</span>
								</div>
							</div>
							<div class="popup-results-asset-cap">
								<span class="popup-asset-marketCap">
									<span class="popup-asset-marketCap-text">
										{{ t('Header_Search_MarketCap') }}:
									</span>
									{{ storeUserPreferences.convertToAbbreviated(crypto.market_cap, storeUserPreferences.selectedCurrency, 'before') }}
								</span>
								<span class="popup-asset-volume">
									<span class="popup-asset-volume-text">
										{{ t('Header_Search_Volume') }}:
									</span>
									{{ storeUserPreferences.convertToAbbreviated(crypto.total_volume, storeUserPreferences.selectedCurrency, 'before') }}
								</span>
							</div>
							<div class="popup-results-asset-price">
								<span class="popup-asset-price">
									{{ storeUserPreferences.convertPrice(crypto.current_price, storeUserPreferences.selectedCurrency, 'before') }}
								</span>
								<span class="popup-asset-percentage" :style="{ color: storeUserPreferences.getPriceColor(crypto.price_change_percentage_24h) }">
									<v-icon>
										{{ storeUserPreferences.getArrowDirection(crypto.price_change_percentage_24h) }}
									</v-icon>
									{{ Math.abs(crypto.price_change_percentage_24h).toFixed(2) }}%
								</span>
							</div>
						</button>
					</div>
					<v-btn 
						v-if="cryptoResults.length > 5" 
						class="popup-show-more-btn"
						variant="text"
						@click="showAllCryptos = !showAllCryptos"
					>
						{{ showAllCryptos ? t('Header_Search_Show_Less') : t('Header_Search_Show_More') }}
					</v-btn>
				</div>

				<!-- Sección de resultados de acciones -->
				<div class="popup-results">
					<p class="popup-title">
						{{ t('Header_Component_Stocks') }}
					</p>
					<div v-if="stockResults.length === 0 && searchQuery.trim() !== ''" class="popup-no-results-text">
						{{ t('Header_Search_No_Results') }}
					</div>
					<div ref="stockScrollContainer" class="popup-results-content">
						<button
      				v-for="stock in (searchQuery.trim() === '' ? storeStocks.stocks.slice(0, 5) : (showAllStocks ? stockResults : stockResults.slice(0, 5)))"
							:key="stock.id"
							@click="goToStock(stock.id)"
							class="popup-results-btn"
							:style="{ backgroundColor: storeUserPreferences.selectedTheme === 'light' ? '#e9ecef' : '#363535' }"
						>
							<div class="popup-results-asset">
								<img :src="stock.image" 
									alt="asset Image" 
									class="popup-asset-image" 
									:class="{ 'popup-stock-image': storeUserPreferences.selectedTheme === 'light' }" 
									@error="storeUserPreferences.showDefaultAssetImage(stock)"
								/>
								<div class="popup-results-asset-name">
									<div class="popup-results-asset-name-rank">
										<span class="popup-asset-name">
											{{ stock.companyName }} 
										</span>
										<span class="popup-asset-rank" :style="{ backgroundColor: storeUserPreferences.selectedTheme === 'light' ? 'var(--asset-rank-background-light)' : 'var(--asset-rank-background-dark)' }">
											#{{ stock.marketCapRank }}
										</span>
									</div>
									<span class="popup-asset-symbol">
										{{ stock.symbol.toUpperCase() }}
									</span>
								</div>
							</div>
							<div class="popup-results-asset-cap">
								<span class="popup-asset-marketCap">
									<span class="popup-asset-marketCap-text">
										{{ t('Header_Search_MarketCap') }}:
									</span>
									{{ storeUserPreferences.convertToAbbreviated(stock.mktCap, storeUserPreferences.selectedCurrency, 'before') }}
								</span>
								<span class="popup-asset-volume">
									<span class="popup-asset-volume-text">
										{{ t('Header_Search_Volume') }}:
									</span>
									{{ storeUserPreferences.convertToAbbreviated(stock.volAvg, storeUserPreferences.selectedCurrency, 'before') }}
								</span>
							</div>
							<div class="popup-results-asset-price">
								<span class="popup-asset-price">
									{{ storeUserPreferences.convertPrice(stock.price, storeUserPreferences.selectedCurrency, 'before') }}
								</span>
								<span class="popup-asset-percentage" :style="{ color: storeUserPreferences.getPriceColor(stock.changesPercentage) }">
									<v-icon>
										{{ storeUserPreferences.getArrowDirection(stock.changesPercentage) }}
									</v-icon>
									{{ Math.abs(stock.changesPercentage).toFixed(2) }}%
								</span>
							</div>
						</button>
					</div>
					<v-btn 
						v-if="stockResults.length > 5" 
						class="popup-show-more-btn"
						variant="text"
						@click="showAllStocks = !showAllStocks"
					>
						{{ showAllStocks ? t('Header_Search_Show_Less') : t('Header_Search_Show_More') }}
					</v-btn>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<style scoped>
.search-container {
	align-items: flex-start;
	width: 800px;
}

.v-card-text  {
	padding: 5px !important;
}

::v-deep(.popup-search .v-field__prepend-inner) {
  margin-right: 10px;
}

.popup-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.popup-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  box-shadow: none;
}

.popup-close-btn:hover {
	box-shadow: none !important;
	background-color: transparent !important;
}

::v-deep(.popup-close-btn .v-btn__overlay) {
  background-color: transparent !important;
}

.popup-search {
	color: var(--white-color) !important;
}

.popup-results {
  height: 50%;
}

.popup-results-content {
  display: flex;
	flex-direction: column;
	overflow-y: auto;
	max-height: 345px;
	padding: 10px;
}

.popup-title {
	font-size: 0.9rem;
	color: var(--gray-color);
	font-weight: bold;
	margin-left: 15px;
}

.popup-no-results-text {
	font-size: 0.9rem;
	color: var(--gray-color);
	margin: 15px 0 0 15px
}

.popup-results-btn {
	height: 55px !important;
	box-shadow: none !important;
	text-transform: none;
	font-weight: normal;
	font-size: 0.9rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	border-radius: 10px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336) !important;
}

.popup-results-btn:not(:last-child) {
	margin-bottom: 10px;
}

.popup-results-btn:hover {
	background-color: var(--primary-color-dark-hover) !important;
	border: solid 2px var(--primary-color-dark-hover);
	box-shadow: 0 3px 5px var(--primary-color-dark-hover) !important;
}

.popup-results-asset {
	display: flex;
}

.popup-asset-image {
	width: 30px;
	height: 30px;
	align-self: center;
	margin-right: 10px;
  border-radius: 50%;
}

.popup-stock-image {
	background-color: var(--background-stock-image);
  border: solid 1px var(--background-stock-image);
}

.popup-results-asset-name {
	display: flex;
	flex-direction: column;
	width: 200px;
	align-items: start;
}

.popup-results-asset-name-rank {
	display: flex;
	align-items: center;
	width: 100%;
}

.popup-asset-name {
	font-size: 0.9rem;
	height: 20px;
	max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
	text-overflow: ellipsis;
	margin-right: 3px;
	max-width: 180px;
}

.popup-asset-rank {
	color: var(--gray-color);
	padding: 0 3px;
	border-radius: 5px;
	margin-left: 3px;
	font-size: 0.8rem;
	font-weight: bold;
}

.popup-asset-symbol {
	font-size: 0.8rem;
	color: var(--gray-color);
}

.popup-results-asset-cap {
	display: flex;
	flex-direction: column;
	align-items: start;
	margin-right: 10px;
	width: 200px;
	padding-left: 50px;
}

.popup-results-asset-price {
	display: flex;
	flex-direction: column;
	align-items: end;
	width: 200px;
}

.popup-asset-marketCap-text, .popup-asset-volume-text {
	font-size: 0.9rem;
	color: var(--gray-color);
}

.popup-asset-price {
	font-size: 0.95rem;
}

.popup-asset-percentage {
	font-size: 0.8rem;
	display: flex;
	align-items: center;
}

.popup-show-more-btn {
  font-size: 0.9rem;
  color: var(--primary-color-brown-hover);
  text-transform: none;
	padding: 5px;
	margin: 10px 15px;
}

.popup-show-more-btn:hover {
  background-color: var(--primary-color-dark-hover);
}

/* Responsive */
@media (max-width: 800px) {
  .search-container {
		width: 350px;
	}

	.popup-results-asset-cap {
		display: none;
	}

	.popup-results-asset-price {
		display: none;
	}

	::v-deep(.popup-search input::placeholder) {
		white-space: normal;
		font-size: 0.75rem;
		margin-right: 30px;
	}
}
</style>