<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement, Filler, annotationPlugin)

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const props = defineProps<{
  stockId: string
}>()

const storeStocks = useStocksStore()
const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()


</script>

<template>
  <div class="main-container">
    <!-- <div class="chart-btn-content">
      <div class="chart-btn">
        <button
          class="chart-btn-value"
          :class="{ selected: selectedType === 'Precio' }"
          @click="selectType('Precio')"
        >
          {{ t('AssetChart_Price') }}
        </button>
        <button
          class="chart-btn-value"
          :class="{ selected: selectedType === 'Market cap' }"
          @click="selectType('Market cap')"
        >
          Market cap
        </button>
      </div>
      <div class="chart-btn">
        <button
          class="chart-btn-value time-btn"
          :class="{ selected: selectedTime === '1D' }"
          @click="selectTime('1D')"
        >
          1D
        </button>
        <button
          class="chart-btn-value time-btn"
          :class="{ selected: selectedTime === '7D' }"
          @click="selectTime('7D')"
        >
          7D
        </button>
        <button
          class="chart-btn-value time-btn"
          :class="{ selected: selectedTime === '1M' }"
          @click="selectTime('1M')"
        >
          1M
        </button>
        <button
          class="chart-btn-value time-btn"
          :class="{ selected: selectedTime === '3M' }"
          @click="selectTime('3M')"
        >
          3M
        </button>
        <button
          class="chart-btn-value time-btn"
          :class="{ selected: selectedTime === '1Y' }"
          @click="selectTime('1Y')"
        >
          1Y
        </button>
      </div>
    </div> -->
    <!-- <div class="crypto-chart">
      <Line v-if="!isLoading" :data="chartData" :options="chartOptions" />
      <span v-else :style="{ color: textColor }">{{ t('AssetChart_Loading') }}</span>
    </div> -->
    <div v-if="storeStocks.stock?.description" class="description-container">
      <p class="description-title">
        {{ t('AssetChart_Title_1') }} 
        {{ storeStocks.stock.companyName }}
        ({{ storeStocks.stock.symbol.toUpperCase() }}){{ t('AssetChart_Title_2') }}  
      </p>
      <p class="description-text">{{ storeStocks.stock?.description }}</p>
    </div>
  </div>
</template>
  
<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  margin: 15px;
}

.chart-btn-content {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}

.chart-btn {
  background-color: v-bind(colorGray);
  border-radius: 8px;
  padding: 5px;
}

.chart-btn-value {
  background-color: transparent;
  box-shadow: none;
  font-size: 0.9rem;
  color: #808080;
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 6px;
}

.chart-btn-value:hover {
  color: v-bind(textColor);
}

.selected {
  background-color: v-bind(colorDarkGray);
  color: v-bind(textColor);
}

.time-btn {
  padding: 5px 10px;
}

.crypto-chart {
	background-color: v-bind(backgroundSettings) !important;
  border: solid 1px #80808050;
}

.description-container {
  margin: 30px 15px 0 15px;
}

.description-title {
  color: v-bind(textColor);
  margin-bottom: 15px;
  font-size: 1.4rem;

}

.description-text {
  color: v-bind(textColor);
  font-size: 0.9rem;
  text-align: justify;
}
</style>