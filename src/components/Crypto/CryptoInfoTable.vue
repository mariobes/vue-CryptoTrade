<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useCryptosStore } from '@/stores/cryptos'
import { useWatchlistsStore } from '@/stores/watchlists'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)

const storeCryptos = useCryptosStore()
const storeWatchlists = useWatchlistsStore()
const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const props = defineProps<{ cryptoId: string }>()

const crypto = computed(() => storeCryptos.crypto)
const cryptoDetails = computed(() => storeCryptos.cryptoDetails)

watch(
  () => props.cryptoId,
  async (id) => {
    if (id) {
      await storeCryptos.GetCrypto(id)
			await storeCryptos.GetCryptoDetails(id)
    }
  },
  { immediate: true }
)

const cryptoAmount = ref(1)
const fiatAmount = ref(0)

const convertToFiat = () => {
  fiatAmount.value = cryptoAmount.value * Number(storeUserPreferences.getConvertedPrice(Number(crypto.value?.current_price), storeUserPreferences.selectedCurrency))
}

const convertToCrypto = () => {
  cryptoAmount.value = fiatAmount.value / Number(storeUserPreferences.getConvertedPrice(Number(crypto.value?.current_price), storeUserPreferences.selectedCurrency))
}

watch(
  () => storeUserPreferences.selectedCurrency,
  () => {
    convertToFiat()
    convertToCrypto()
  }
)

watch(crypto, (newVal) => {
  if (newVal) convertToFiat()
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const showAllExplorers = ref(false)

const filteredExplorers = computed(() =>
  cryptoDetails.value?.links?.blockchain_site?.filter(link => !!link) ?? []
)

const getDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}

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
    }
  } else {
    const success = await storeWatchlists.CreateWatchlist(userId, cryptoId, 'Crypto', token)
    if (success) {
      watchlist.value.push(cryptoId)
    }
  }
}

onMounted(() => {
  loadWatchlist()
	window.scrollTo({ top: 0 })
})
</script>

<template>
	<div class="main-container" v-if="crypto">
		<div>
			<div class="crypto-content-name-favorite">
				<div class="crypto-content-name">
					<img :src="crypto.image" alt="Crypto Logo" class="crypto-image" @error="storeUserPreferences.showDefaultAssetImage(crypto)" />
					<span class="crypto-name">{{ crypto.name }}</span>
					<span class="crypto-symbol mt-1">{{ crypto.symbol.toUpperCase() }}</span>
					<span class="crypto-rank" :style="{ backgroundColor: storeUserPreferences.selectedTheme === 'light' ? 'var(--asset-rank-background-light)' : 'var(--asset-rank-background-dark)' }">
						#{{ crypto.marketCapRank }}
					</span>
				</div>
				<div class="crypto-content-favorite">
					<span v-if="storeAuth.isLoggedIn()" @click.stop="toggleFavorite(crypto.id)" class="favorite-icon">
						<span 
							v-if="watchlist.includes(crypto.id)" 
							class="mdi mdi-star favorite-icon-active"
						></span>
						<span 
							v-else 
							class="mdi mdi-star-outline"
						></span>
					</span>
				</div>
			</div>

			<div class="crypto-content-price">
				<span class="crypto-price">{{ storeUserPreferences.convertPrice(crypto.current_price, storeUserPreferences.selectedCurrency, 'after') }}</span>
				<span class="crypto-percentage" :style="{ color: storeUserPreferences.getPriceColor(crypto.price_change_percentage_24h) }">
					<v-icon class="mb-1">
						{{ storeUserPreferences.getArrowDirection(crypto.price_change_percentage_24h) }}
					</v-icon>
					{{ Math.abs(crypto.price_change_percentage_24h).toFixed(2) }}% (1D)
				</span>
			</div>
		</div>

		<div class="crypto-content-cap">
			<div class="crypto-container-cap crypto-cap">
				<span class="crypto-content-title">{{ t('CryptoInfoTable_MarketCap') }}</span>
				<div>
					<span class="crypto-content-value">{{ storeUserPreferences.convertToAbbreviated(crypto.market_cap, storeUserPreferences.selectedCurrency, 'after') }}</span>
					<span class="crypto-content-percentage" :style="{ color: storeUserPreferences.getPriceColor(crypto.market_cap_change_percentage_24h) }">
						<v-icon class="crypto-content-percentage-icon">
							{{ storeUserPreferences.getArrowDirection(crypto.market_cap_change_percentage_24h) }}
						</v-icon>
						{{ Math.abs(crypto.market_cap_change_percentage_24h).toFixed(2) }}%
					</span>
				</div>
			</div>

			<div class="crypto-container-cap">
				<span class="crypto-content-title">{{ t('CryptoInfoTable_Volume') }}</span>
				<span class="crypto-content-value">{{ storeUserPreferences.convertToAbbreviated(crypto.total_volume, storeUserPreferences.selectedCurrency, 'after') }}</span>
			</div>

			<div class="crypto-container-cap">
				<span class="crypto-content-title">{{ t('CryptoInfoTable_FDV') }}</span>
				<span class="crypto-content-value">{{ storeUserPreferences.convertToAbbreviated(crypto.fully_diluted_valuation, storeUserPreferences.selectedCurrency, 'after') }}</span>
			</div>

			<div class="crypto-container-cap">
				<span class="crypto-content-title">{{ t('CryptoInfoTable_Vol/MktCap') }}</span>
				<span class="crypto-content-value">
					{{ ((crypto.total_volume / crypto.market_cap) * 100).toFixed(2) }}%
				</span>
			</div>

			<div class="crypto-container-cap">
				<span class="crypto-content-title">{{ t('CryptoInfoTable_Total_Supply') }}</span>
				<span class="crypto-content-value">{{ storeUserPreferences.convertToAbbreviated(crypto.total_supply, storeUserPreferences.selectedCurrency) }} {{ crypto.symbol.toLocaleUpperCase() }}</span>
			</div>

			<div class="crypto-container-cap">
				<span class="crypto-content-title">{{ t('CryptoInfoTable_MaxSupply') }}</span>
				<span class="crypto-content-value">{{ storeUserPreferences.convertToAbbreviated(crypto.max_supply, storeUserPreferences.selectedCurrency) }} {{ crypto.symbol.toLocaleUpperCase() }}</span>
			</div>

			<div class="crypto-container-cap">
				<span class="crypto-content-title">{{ t('CryptoInfoTable_CirculatingSupply') }}</span>
				<span class="crypto-content-value">{{ storeUserPreferences.convertToAbbreviated(crypto.circulating_supply, storeUserPreferences.selectedCurrency) }} {{ crypto.symbol.toLocaleUpperCase() }}</span>
			</div>
		</div>

		<div class="crypto-links-container">
			<div class="crypto-links-content">
				<span class="crypto-links-title">{{ t('CryptoInfoTable_Website') }}</span>
				<span>
					<a 
						v-if="cryptoDetails?.links && cryptoDetails.links.homepage?.[0]"
						:href="cryptoDetails.links.homepage[0]" 
						target="_blank" 
						class="crypto-link"
					>
						<span class="mdi mdi-web pr-1"></span>
						<span>Website</span>
					</a>
					<a 
						v-if="cryptoDetails?.links && cryptoDetails.links.whitepaper" 
						:href="cryptoDetails.links.whitepaper" 
						target="_blank" 
						class="crypto-link"
					>
						<span class="mdi mdi-file-document pr-1"></span>
						<span>Whitepaper</span>
					</a>
				</span>
			</div>

			<div class="crypto-links-content">
				<span class="crypto-links-title">{{ t('CryptoInfoTable_Socials') }}</span>
				<span>
					<a 
						v-if="cryptoDetails?.links && cryptoDetails.links.twitter_screen_name" 
						:href="`https://twitter.com/${cryptoDetails.links.twitter_screen_name}`" 
						target="_blank" 
						class="crypto-link"
					>
					<span class="mdi mdi-twitter icon-twitter"></span>
					</a>
					<a 
						v-if="cryptoDetails?.links && cryptoDetails.links.subreddit_url" 
						:href="cryptoDetails.links.subreddit_url" 
						target="_blank" 
						class="crypto-link"
					>
					<span class="mdi mdi-reddit icon-reddit"></span>
					</a>
					<a
						v-if="cryptoDetails?.links && cryptoDetails.links.repos_url?.github && cryptoDetails.links.repos_url.github.length"
						:href="cryptoDetails.links.repos_url.github[0]"
						target="_blank"
						class="crypto-link"
					>
					<span class="mdi mdi-github"></span>
					</a>
				</span>
			</div>

			<div class="crypto-links-content">
				<span class="crypto-links-title">{{ t('CryptoInfoTable_Explorers') }}</span>
				<span class="crypto-explorers">
					<a
						v-if="filteredExplorers && filteredExplorers.length"
						:href="filteredExplorers[0]"
						target="_blank"
						class="crypto-link"
					>
						<span>{{ getDomainFromUrl(filteredExplorers[0]) }}</span>
					</a>
					<v-icon
						v-if="filteredExplorers && filteredExplorers.length > 1"
						class="toggle-arrow"
						@click="showAllExplorers = !showAllExplorers"
					>
						{{ showAllExplorers ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
					</v-icon>
					<transition name="fade">
						<template v-if="showAllExplorers">
							<div class="explorer-popup">
								<a
									v-for="(link, index) in filteredExplorers.slice(1)"
									:key="index"
									:href="link"
									target="_blank"
									class="crypto-link crypto-link-explorer"
								>
									<span>{{ getDomainFromUrl(link) }}</span>
								</a>
							</div>
						</template>
					</transition>
				</span>
			</div>
		</div>

		<div class="historical-data-container">
			<div class="historical-data-content">
				<div class="historical-data-text">
					<span class="historical-data-title">{{ t('CryptoInfoTable_Ath') }}</span>
					<span class="historical-data-date">{{ crypto.ath_date ? formatDate(String(crypto.ath_date)) : '---' }}</span>
				</div>
				<div class="historical-data-price">
					<span>{{ crypto.ath ? storeUserPreferences.convertPrice(crypto.ath, storeUserPreferences.selectedCurrency, 'before') : '0' }}</span>
					<span :style="{ color: storeUserPreferences.getPriceColor(crypto.ath_change_percentage) }">
						{{ crypto.ath_change_percentage ? crypto.ath_change_percentage.toFixed(2) : '0' }}%
					</span>
				</div>
			</div>

			<div class="historical-data-content">
				<div class="historical-data-text">
					<span class="historical-data-title">{{ t('CryptoInfoTable_Atl') }}</span>
					<span class="historical-data-date">{{ crypto.atl_date ? formatDate(String(crypto.atl_date)) : '---' }}</span>
				</div>
				<div>
					<span class="historical-data-price">{{ crypto.atl ? storeUserPreferences.convertPrice(crypto.atl, storeUserPreferences.selectedCurrency, 'before') : '0' }}</span>
					<span :style="{ color: storeUserPreferences.getPriceColor(crypto.atl_change_percentage) }">
						{{ crypto.atl_change_percentage > 0 ? '+' : '' }}{{ crypto.atl_change_percentage ? (crypto.atl_change_percentage ?? 0).toFixed(2) : '0' }}%
					</span>
				</div>
			</div>
		</div>

		<div class="converter-container">
			<div class="converter-title">
				{{ t('CryptoInfoTable_Converter_1') }} 
				{{ crypto.symbol.toLocaleUpperCase() }} 
				{{ t('CryptoInfoTable_Converter_2') }} 
				{{ storeUserPreferences.selectedCurrency }}
			</div>
			
			<div class="converter-content">
				<div class="converter-crypto">
					<label class="converter-text">{{ crypto.symbol.toUpperCase() }}</label>
					<input
						class="converter-value"
						v-model.number="cryptoAmount"
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
						@input="convertToCrypto"
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

.crypto-content-name-favorite {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.crypto-content-name {
	display: flex;
  align-items: center;
}

.favorite-icon-active {
  color: var(--gold-color);
}

.favorite-icon {
  color: v-bind(textColor);
	cursor: pointer;
	font-size: 1.6rem;
	margin-right: 15px;
}

.favorite-icon:hover {
  color: var(--gold-color);
}

.crypto-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}

.crypto-name {
	margin-right: 10px;
	font-size: 1.6rem;
	font-weight: bold;
	max-width: 200px;
}

.crypto-symbol {
	font-size: 1.2rem;
	font-weight: bold;
	color: var(--gray-color);
}

.crypto-rank {
	color: var(--gray-color);
	padding: 0 3px;
	border-radius: 5px;
	margin-left: 5px;
	font-size: 0.85rem;
	font-weight: bold;
}

.crypto-content-price {
	display: flex;
	margin-top: 5px;
}

.crypto-price {
	font-size: 2.5rem;
	font-weight: bold;
	margin-right: 10px;
	white-space: nowrap;
}

.crypto-percentage {
	font-size: 1rem;
	display: flex;
	font-weight: bold;
	align-items: center;
	white-space: nowrap;
}

.crypto-content-cap {
  display: flex;
  flex-wrap: wrap;
	margin: 20px 0;
}

.crypto-container-cap {
  flex: 1 1 calc(50% - 10px);
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-radius: 10px;
	border: solid 1px var(--dark-gray-color);
	margin: 5px;
	display: flex;
	flex-direction: column;
}

.crypto-content-title {
	color: var(--gray-color);
	font-size: 0.8rem;
}

.crypto-content-value {
	font-size: 1rem;
}

.crypto-content-percentage {
	font-size: 0.9rem;
}

.crypto-content-percentage-icon {
	font-size: 1.1rem;
	margin-bottom: 2px;
	margin-left: 5px;
}

a {
  text-decoration: none;
  color: v-bind(textColor);
}

.crypto-links-content {
	display: flex;
	justify-content: space-between;
	margin: 15px 0;
}

.crypto-links-title {
	color: var(--gray-color);
}

.crypto-link {
	background-color: v-bind(colorGray);
	border-radius: 20px;
	padding: 5px;
	font-size: 0.8rem;
	margin: 0 3px;
}

.crypto-link:hover {
	background-color: var(--primary-color);
}

.icon-twitter {
	color: #1DA1F2;
}

.icon-reddit {
	color: #FF4500;
}

.crypto-explorers {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.explorer-popup {
  position: absolute;
  left: 455px;
  z-index: 999;
  background-color: v-bind(backgroundColor);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 5px;
}

.crypto-link-explorer {
  display: block;
  margin-bottom: 5px;
  font-size: 0.8rem;
  color: v-bind(textColor);
	border: solid 1px var(--dark-gray-color);
	max-width: 100px;
	overflow: hidden; 
  text-overflow: ellipsis; 
	text-align: center;
}

.toggle-arrow {
  cursor: pointer;
  margin-left: 5px;
  font-size: 1rem;
  color: v-bind(textColor);
	border-radius: 10px;
	background-color: v-bind(colorGray);
	padding: 10px;
}

.toggle-arrow:hover {
  background-color: var(--primary-color);
}

.historical-data-container {
	margin-bottom: 10px;
}

.historical-data-content {
	display: flex;
	justify-content: space-between;
	margin: 15px 0;
}

.historical-data-text {
	display: flex;
	flex-direction: column;
}

.historical-data-price {
	display: flex;
	flex-direction: column;
	align-items: end;
}

.historical-data-title {
	color: var(--gray-color);
	padding-bottom: 2px;
}

.historical-data-date {
	color: var(--gray-color);
	font-size: 0.85rem;
}

.converter-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
  border: solid 3px var(--dark-gray-color);
  border-radius: 10px;
}

.converter-crypto {
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
	color: var(--gray-color);
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
  background-color: var(--dark-gray-color);
  border: none;
}
</style>