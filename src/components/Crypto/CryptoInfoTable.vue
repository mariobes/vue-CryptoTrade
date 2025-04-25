<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)

const props = defineProps<{ cryptoId: string }>()

const { t } = useI18n()

const storeCryptos = useCryptosStore()
const storeUserPreferences = useUserPreferencesStore()

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
  fiatAmount.value = cryptoAmount.value * crypto.value.current_price
}

const convertToCrypto = () => {
  cryptoAmount.value = fiatAmount.value / crypto.value.current_price
}

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
  cryptoDetails.value?.links.blockchain_site.filter(link => !!link)
)

const getDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}
</script>

<template>
    <div class="main-container" v-if="crypto">
			<div>
				<div class="crypto-content-name">
					<img :src="crypto.image" alt="Crypto Logo" class="crypto-image" @error="crypto.image = '/src/assets/asset-default.png'" />
					<span class="crypto-name">{{ crypto.name }}</span>
					<span class="crypto-symbol mt-1">{{ crypto.symbol.toUpperCase() }}</span>
					<span class="crypto-rank" :style="{ backgroundColor: storeUserPreferences.selectedTheme === 'light' ? '#f0eded' : '#313030' }">
						#{{ crypto.marketCapRank }}
					</span>
				</div>
				<div class="crypto-content-price">
					<span class="crypto-price">{{ storeUserPreferences.convertPrice(crypto.current_price, storeUserPreferences.selectedCurrency, 'after') }}</span>
					<span class="crypto-percentage" :style="{ color: storeUserPreferences.getPriceColor(crypto.price_change_percentage_24h) }">
						<v-icon 
							:color="storeUserPreferences.getPriceColor(crypto.price_change_percentage_24h)">
							{{ storeUserPreferences.getArrowDirection(crypto.price_change_percentage_24h) }}
						</v-icon>
						{{ crypto.price_change_percentage_24h.toFixed(2) }}% (1D)
					</span>
				</div>
			</div>

			<div class="crypto-content-cap">
				<div class="crypto-container-cap crypto-cap">
					<span class="crypto-content-title">{{ t('CryptoInfoTable_MarketCap') }}</span>
					<div>
						<span class="crypto-content-value">{{ storeUserPreferences.convertToAbbreviated(crypto.market_cap, storeUserPreferences.selectedCurrency, 'after') }}</span>
						<span class="crypto-content-percentage" :style="{ color: storeUserPreferences.getPriceColor(crypto.market_cap_change_percentage_24h) }">
							<v-icon class="crypto-content-percentage-icon"
								:color="storeUserPreferences.getPriceColor(crypto.market_cap_change_percentage_24h)">
								{{ storeUserPreferences.getArrowDirection(crypto.market_cap_change_percentage_24h) }}
							</v-icon>
							{{ crypto.market_cap_change_percentage_24h.toFixed(2) }}%
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
							v-if="cryptoDetails?.links.homepage?.[0]"
							:href="cryptoDetails.links.homepage[0]" 
							target="_blank" 
							class="crypto-link"
						>
							<span class="mdi mdi-web pr-1"></span>
							<span>Website</span>
						</a>
						<a 
							v-if="cryptoDetails?.links.whitepaper" 
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
							v-if="cryptoDetails?.links.twitter_screen_name" 
							:href="`https://twitter.com/${cryptoDetails.links.twitter_screen_name}`" 
							target="_blank" 
							class="crypto-link"
						>
						<span class="mdi mdi-twitter icon-twitter"></span>
						</a>
						<a 
							v-if="cryptoDetails?.links.subreddit_url" 
							:href="cryptoDetails.links.subreddit_url" 
							target="_blank" 
							class="crypto-link"
						>
						<span class="mdi mdi-reddit icon-reddit"></span>
						</a>
						<a
							v-if="cryptoDetails?.links.repos_url.github && cryptoDetails.links.repos_url.github.length"
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
						<span class="historical-data-date">{{ formatDate(crypto.ath_date) }}</span>
					</div>
					<div class="historical-data-price">
						<span>{{ storeUserPreferences.convertPrice(crypto.ath, storeUserPreferences.selectedCurrency, 'before') }}</span>
						<span :style="{ color: storeUserPreferences.getPriceColor(crypto.ath_change_percentage) }">
							{{ crypto.ath_change_percentage.toFixed(2) }}%
						</span>
					</div>
				</div>

				<div class="historical-data-content">
					<div class="historical-data-text">
						<span class="historical-data-title">{{ t('CryptoInfoTable_Atl') }}</span>
						<span class="historical-data-date">{{ formatDate(crypto.atl_date) }}</span>
					</div>
					<div>
						<span class="historical-data-price">{{ storeUserPreferences.convertPrice(crypto.atl, storeUserPreferences.selectedCurrency, 'before') }}</span>
						<span :style="{ color: storeUserPreferences.getPriceColor(crypto.atl_change_percentage) }">
							{{ crypto.atl_change_percentage > 0 ? '+' : '' }}{{ (crypto.atl_change_percentage ?? 0).toFixed(2) }}%
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

.crypto-content-name {
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
	font-size: 1.6rem;
	font-weight: bold;
}

.crypto-symbol {
	font-size: 1.2rem;
	font-weight: bold;
	color: #808080;
}

.crypto-rank {
	color: #808080;
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
	border: solid 1px #80808050;
	margin: 5px;
	display: flex;
	flex-direction: column;
}

.crypto-content-title {
	color: #808080;
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

.crypto-links-container {
	
}

.crypto-links-title {
	color: #808080;
}

.crypto-links-content {
	display: flex;
	justify-content: space-between;
	margin: 15px 0;
}

.crypto-link {
	background-color: v-bind(colorGray);
	border-radius: 20px;
	padding: 5px;
	font-size: 0.8rem;
	margin: 0 3px;
}

.crypto-link:hover {
	background-color: #FF8C00;
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
	border: solid 1px #80808062;
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
  background-color: #FF8C00;
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
	color: #808080;
	padding-bottom: 2px;
}

.historical-data-date {
	color: #808080;
	font-size: 0.85rem;
}

.converter-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
  border: solid 3px #80808050;
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