<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundTableColor = computed(() => storeUserPreferences.getTheme().background_table)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const storeCryptos = useCryptosStore()

const totalMarketCap = ref() //ref(null)
const marketCapChangePercentage = ref<number | null>(null)
const fearGreedValue = ref<number | null>(null)
const fearGreedSentiment = ref<string | null>(null)
const valueCMC100Index = ref() //ref(null)
const CMC100IndexChangePercentage = ref<number | null>(null)

const formatMarketCap = (value: number): string => {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  return value.toString();
}

function getPercentageColor(percentage: number) {
  return percentage > 0 ? 'green' : 'red';
}

function getCirclePosition(value: number) {
  return `${value}%`;
}

function getSentimentTranslation(sentiment: string) {
  switch (sentiment) {
    case 'Extreme fear':
      return t('CryptoIndices_Sentiment_Extreme_Fear');
    case 'Fear':
      return t('CryptoIndices_Sentiment_Fear');
    case 'Neutral':
      return t('CryptoIndices_Sentiment_Neutral');
    case 'Greed':
      return t('CryptoIndices_Sentiment_Greed');
    case 'Extreme greed':
      return t('CryptoIndices_Sentiment_Extreme_Greed');
    default:
      return sentiment;
  }
}

// onMounted(() => {
//   storeCryptos.GetTotalMarketCap().then(() => {
//     totalMarketCap.value = formatMarketCap(storeCryptos.totalMarketCapCryptos.totalMarketCap)
//     marketCapChangePercentage.value = parseFloat(storeCryptos.totalMarketCapCryptos.marketCapChangePercentage.toFixed(2))
//   })

//   storeCryptos.GetFearGreedIndex().then(() => {
//     fearGreedValue.value = storeCryptos.fearGreedIndexCryptos.value
//     fearGreedSentiment.value = storeCryptos.fearGreedIndexCryptos.valueClassification
//   })

//   storeCryptos.GetCMC100Index().then(() => {
//     valueCMC100Index.value = formatMarketCap(storeCryptos.CMC100IndexCryptos.value)
//     CMC100IndexChangePercentage.value = parseFloat(storeCryptos.CMC100IndexCryptos.percentageChange.toFixed(2))
//   })
// })

onMounted(() => {
  totalMarketCap.value = 2.68
  marketCapChangePercentage.value = -2.12

  fearGreedValue.value = 33
  fearGreedSentiment.value = 'Fear'

  valueCMC100Index.value = 166.28
  CMC100IndexChangePercentage.value = -3.9
})
</script>

<template>
  <div class="index-container">
    <div class="index-section">
      <div class="index-section-content index-section-content-cap">
        <p class="title-index cap-index">{{ t('CryptoIndices_Index_1') }}</p>
        <p class="price-index">${{ totalMarketCap }}</p>
        <p>
          <span
            :style="{ color: marketCapChangePercentage !== null ? getPercentageColor(marketCapChangePercentage) : 'black' }">
            {{ marketCapChangePercentage }}%
          </span>
        </p>
      </div>

      <div class="index-section-content">
        <p class="title-index cap-index">{{ t('CryptoIndices_Index_2') }}</p>
        <p class="price-index">${{ valueCMC100Index }}</p>
        <p>
          <span
            :style="{ color: CMC100IndexChangePercentage !== null ? getPercentageColor(CMC100IndexChangePercentage) : 'black' }">
            {{ CMC100IndexChangePercentage }}%
          </span>
        </p>
      </div>
    </div>

    <div class="index-content">
      <p class="title-index">{{ t('CryptoIndices_Index_3') }}</p>
      <!-- Barra de colores -->
      <div class="fear-greed-bar"></div>
      <!-- Círculo marcador -->
      <div class="fear-greed-circle" :style="{ left: getCirclePosition(fearGreedValue) }"></div>
      <p class="feeling-value">{{ fearGreedValue }}</p>
      <p class="feeling-text">{{ getSentimentTranslation(fearGreedSentiment) }}</p>
    </div>
  </div>
</template>

<style scoped>
.index-section {
  display: flex;
  height: 50%;
}

.index-section-content {
  background-color: v-bind(backgroundTableColor);
  border-radius: 20px;
  padding: 10px 20px;
  width: 50%;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.index-section-content-cap {
  margin-right: 20px;
}

.index-content {
  background-color: v-bind(backgroundTableColor);
  border-radius: 20px;
  padding: 10px 30px;
  text-align: center;
  height: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.index-content .title-index {
  padding-bottom: 20px;
}

.title-index {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 5px 0;
  color: v-bind(textColor);
}

.cap-index {
  height: 50%;
}

.price-index {
  font-size: 1.2rem;
  font-weight: bold;
  color: v-bind(textColor);
}

.fear-greed-bar {
  width: 100%;
  height: 10px;
  background: linear-gradient(to right, 
    red 0%, 
    orange 20%, 
    yellow 40%, 
    green 60%, 
    turquoise 80%
  );
  border-radius: 10px;
}

.fear-greed-circle {
  position: relative;
  transform: translate(-50%, -70%);
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  border: 2px solid black;
}

.feeling-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: v-bind(textColor);
}

.feeling-text {
  color: v-bind(textColor);
  font-weight: bold;
  font-size: 1.2rem;
}


</style>

