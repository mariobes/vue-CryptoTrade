<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useMarketsStore } from '@/stores/markets'
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundTableColor = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()
const storeMarkets = useMarketsStore()

const { t } = useI18n()

const totalMarketCap = ref()
const marketCapChangePercentage = ref()
const valueCMC100Index = ref()
const CMC100IndexChangePercentage = ref()
const fearGreedValue = ref()
const fearGreedSentiment = ref()

onMounted(async () => {
  await storeMarkets.GetCryptoIndices();
  const cryptoIndicesData = storeMarkets.cryptoIndices;

  cryptoIndicesData.forEach((index) => {
    switch (index.name) {
      case 'total-market-cap':
        totalMarketCap.value = index.value;
        marketCapChangePercentage.value = parseFloat(index.changePercentage?.toFixed(2) || '0');
        break;
      case 'CMC100-index':
        valueCMC100Index.value = index.value;
        CMC100IndexChangePercentage.value = parseFloat(index.changePercentage?.toFixed(2) || '0');
        break;
      case 'fear-greed-index':
        fearGreedValue.value = index.value;
        fearGreedSentiment.value = index.sentiment;
        break;
    }
  });
});

storeMarkets.GetCryptoIndices()

const getCirclePosition = (value: number | null) => `${value ?? 0}%`
const getSentimentTranslation = (sentiment: string | null) => {
  const map: Record<string, string> = {
    'Extreme fear': t('CryptoIndices_Sentiment_Extreme_Fear'),
    'Fear': t('CryptoIndices_Sentiment_Fear'),
    'Neutral': t('CryptoIndices_Sentiment_Neutral'),
    'Greed': t('CryptoIndices_Sentiment_Greed'),
    'Extreme greed': t('CryptoIndices_Sentiment_Extreme_Greed'),
  }
  return map[sentiment ?? ''] ?? sentiment
}
</script>

<!-- <div class="index-section">
  <div class="index-section-content index-section-content-cap">
    <p class="title-index cap-index">{{ t('CryptoIndices_Index_1') }}</p>
    <p class="price-index">
      {{ storeUserPreferences.convertToAbbreviated(totalMarketCap, storeUserPreferences.selectedCurrency, 'before') }}
    </p>
    <p>
      <span :style="{ color: storeUserPreferences.getPriceColor(marketCapChangePercentage) }">
        {{ marketCapChangePercentage > 0 ? '+' : '' }}{{ marketCapChangePercentage }}%
      </span>
    </p>
  </div>

  <div class="index-section-content">
    <p class="title-index cap-index">{{ t('CryptoIndices_Index_2') }}</p>
    <p class="price-index">
      {{ storeUserPreferences.convertToAbbreviated(valueCMC100Index, storeUserPreferences.selectedCurrency, 'before') }}
    </p>
    <p>
      <span :style="{ color: storeUserPreferences.getPriceColor(CMC100IndexChangePercentage) }">
        {{ CMC100IndexChangePercentage > 0 ? '+' : '' }}{{ CMC100IndexChangePercentage }}%
      </span>
    </p>
  </div>
</div> -->

<template>
  <div class="index-container">
    <div class="index-section">
      <div class="index-section-content index-section-content-cap">
        <p class="title-index cap-index">{{ t('CryptoIndices_Index_1') }}</p>
        <p class="price-index">
          {{ storeUserPreferences.convertToAbbreviated(totalMarketCap, storeUserPreferences.selectedCurrency, 'before') }}
        </p>
        <p>
          <span :style="{ color: storeUserPreferences.getPriceColor(marketCapChangePercentage) }">
            {{ marketCapChangePercentage > 0 ? '+' : '' }}{{ marketCapChangePercentage }}%
          </span>
        </p>
      </div>

      <div class="index-section-content">
        <p class="title-index cap-index">{{ t('CryptoIndices_Index_2') }}</p>
        <p class="price-index">
          {{ storeUserPreferences.convertToAbbreviated(valueCMC100Index, storeUserPreferences.selectedCurrency, 'before') }}
        </p>
        <p>
          <span :style="{ color: storeUserPreferences.getPriceColor(CMC100IndexChangePercentage) }">
            {{ CMC100IndexChangePercentage > 0 ? '+' : '' }}{{ CMC100IndexChangePercentage }}%
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
  margin-top: 5px;
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

