<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement, Filler, annotationPlugin)

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const props = defineProps<{
  cryptoId: string
  cryptoDetails: any
}>()

const storeCryptos = useCryptosStore()
const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const selectedType = ref('Price')
const selectedTime = ref('1D')
const isLoading = ref(true)

const timeToDays = {
  '1D': 1,
  '7D': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
} as const

const fetchChartData = async () => {
  isLoading.value = true
  const days = timeToDays[selectedTime.value as keyof typeof timeToDays] ?? 1
  await storeCryptos.GetCryptoCharts(props.cryptoId, days)
  isLoading.value = false
}

onMounted(fetchChartData)
watch(selectedTime, fetchChartData)

const selectType = (type: string) => selectedType.value = type
const selectTime = (time: string) => selectedTime.value = time

interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const chartData = computed(() => {
  const chart = storeCryptos.chartsCryptos as unknown as CryptoChartData
  if (!chart || !chart.prices?.length) return { labels: [], datasets: [] }

  const isMarketCap = selectedType.value === 'Market cap'
  const rawData = isMarketCap ? chart.market_caps : chart.prices
  const baseline = chart.prices[0][1]

  if (isMarketCap) {
    return {
      datasets: [{
        label: 'Market cap',
        data: rawData.map(([x, y]: number[]) => ({ x, y })),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 1.5,
        pointHoverBorderColor: 'white',
        pointHoverBackgroundColor: '#3b82f6',
        tension: 0,
      }]
    }
  }

  const data = rawData.map(([x, y]: number[]) => ({ x, y }))
  const datasets = []
  let segment: any[] = []
  let previousPoint = null

  for (let i = 0; i < data.length; i++) {
    const point = data[i]
    if (previousPoint) {
      const crossed = (previousPoint.y - baseline) * (point.y - baseline) < 0
      if (crossed) {
        const ratio = (baseline - previousPoint.y) / (point.y - previousPoint.y)
        const xCross = previousPoint.x + ratio * (point.x - previousPoint.x)
        const crossingPoint = { x: xCross, y: baseline }
        segment.push(crossingPoint)
        datasets.push(createSegment(segment, previousPoint.y >= baseline ? 'green' : 'red', baseline))
        segment = [crossingPoint]
      }
    }
    segment.push(point)
    previousPoint = point
  }

  if (segment.length > 1 && previousPoint) {
    datasets.push(createSegment(segment, previousPoint.y >= baseline ? 'green' : 'red', baseline))
  }

  return { datasets }
})

function createSegment(data: any[], color: string, baseline: number) {
  const isGreen = color === 'green'
  return {
    data,
    borderColor: isGreen ? '#4ade80' : '#ef4444',
    backgroundColor: (ctx: { chart: { ctx: any; chartArea: any } }) => createGradient(ctx, color),
    borderWidth: 2,
    fill: { target: { value: baseline } },
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 1.5,
    pointHoverBorderColor: 'white',
    pointHoverBackgroundColor: isGreen ? '#4ade80' : '#ef4444',
    tension: 0,
  }
}

function createGradient(ctx: { chart: { ctx: any; chartArea: any } }, color: string) {
  const { ctx: canvasCtx, chartArea } = ctx.chart
  if (!chartArea) return
  const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  if (color === 'green') {
    gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)')
    gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')
  } else {
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)')
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0)')
  }
  return gradient
}

const gridColor = computed(() => {
  return storeUserPreferences.selectedTheme === 'dark' ? '#3a3535' : '#d3d3d3';
})

const chartOptions = computed(() => {
  const chart = storeCryptos.chartsCryptos as unknown as CryptoChartData
  if (!chart?.prices?.length) return {}

  const first = new Date(chart.prices[0][0])
  const last = new Date(chart.prices[chart.prices.length - 1][0])

  return {
    responsive: true,
    animation: { duration: 0 },
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x'
    },
    plugins: {
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'nearest',
        axis: 'x',
        backgroundColor: backgroundColor.value,
        titleColor: textColor.value,
        bodyColor: textColor.value,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (context: { parsed: { x: string | number | Date } }[]) => {
            const date = new Date(context[0].parsed.x)
            return date.toLocaleString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          },
          label: (context: { parsed: { y: any } }) => {
            const isMarketCap = selectedType.value === 'Market cap'
            const value = context.parsed.y
            let price
            if (isMarketCap) {
              price = storeUserPreferences.convertToAbbreviated(value, storeUserPreferences.selectedCurrency, 'after')
              return `Market Cap: ${price}`
            } else {
              price = storeUserPreferences.convertPrice(value, storeUserPreferences.selectedCurrency, 'after')
              return `${t('AssetChart_Price')}: ${price}`
            }  
          },
          afterLabel: (context: { parsed: { x: any } }) => {
            const chart = storeCryptos.chartsCryptos as unknown as CryptoChartData
            const timestamp = context.parsed.x

            if (!chart?.total_volumes?.length) return ''

            let closest = chart.total_volumes.reduce((prev, curr) => {
              return Math.abs(curr[0] - timestamp) < Math.abs(prev[0] - timestamp) ? curr : prev
            })

            const volume = storeUserPreferences.convertToAbbreviated(closest[1], storeUserPreferences.selectedCurrency, 'after')
            return `Vol. 24 h: ${volume}`
          }
        }
      },
      legend: { display: false },
      annotation: {
        annotations: selectedType.value !== 'Market cap' ? {
          baseline: {
            type: 'line',
            yMin: chart.prices[0][1],
            yMax: chart.prices[0][1],
            borderColor: textColor.value,
            borderWidth: 1,
            borderDash: [1, 3],
          },
          currentPrice: {
            type: 'label',
            xValue: chart.prices[chart.prices.length - 1][0],
            yValue: chart.prices[chart.prices.length - 1][1],
            backgroundColor: () => {
              const last = chart.prices[chart.prices.length - 1][1]
              const first = chart.prices[0][1]
              return last >= first ? '#4ade80' : '#ef4444'
            },
            color: 'white',
            content: [
              storeUserPreferences.convertPrice(chart.prices[chart.prices.length - 1][1], storeUserPreferences.selectedCurrency)
            ],
            font: {
              weight: 'bold',
              size: 11
            },
            position: {
              x: 'end',
              y: 'center'
            },
            xAdjust: 0,
            yAdjust: 0,
            padding: 5,
            borderRadius: 6,
          },
          initialPriceBox: {
            type: 'label',
            xValue: chart.prices[0][0],
            yValue: chart.prices[0][1],
            backgroundColor: '#d6d2d2',
            color: '#232323',
            content: [
              storeUserPreferences.convertPrice(chart.prices[0][1], storeUserPreferences.selectedCurrency)
            ],
            font: {
              weight: 'bold',
              size: 11
            },
            position: {
              x: 'start',
              y: 'center'
            },
            xAdjust: 5,
            yAdjust: 0,
            padding: 4,
            borderRadius: 6,
          }
        } : {
          marketCapLabel: {
            type: 'label',
            xValue: chart.market_caps[chart.market_caps.length - 1][0],
            yValue: chart.market_caps[chart.market_caps.length - 1][1],
            backgroundColor: '#3b82f6',
            color: 'white',
            content: [
              storeUserPreferences.convertToAbbreviated(chart.market_caps[chart.market_caps.length - 1][1], storeUserPreferences.selectedCurrency)
            ],
            font: {
              weight: 'bold',
              size: 11
            },
            position: {
              x: 'end',
              y: 'center'
            },
            xAdjust: 0,
            yAdjust: 0,
            padding: 5,
            borderRadius: 6,
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        min: first.getTime(),
        max: last.getTime(),
        time: {
          unit: selectedTime.value === '1Y' ? 'month' :
                selectedTime.value === '1M' ? 'day' :
                selectedTime.value === '3M' ? 'day' : 'hour',
          stepSize: selectedTime.value === '1D' ? 2 :
                    selectedTime.value === '7D' ? 12 :
                    selectedTime.value === '3M' ? 14 : 1,
          tooltipFormat: selectedTime.value === '1Y' ? 'MMM yyyy' :
                         selectedTime.value === '1M' ? 'dd MMM' :
                         selectedTime.value === '3M' ? 'dd MMM' : 'HH:mm dd MMM',
          displayFormats: {
            hour: 'HH:mm',
            day: 'dd MMM',
            month: 'MMM yyyy',
          }
        },
        ticks: {
          autoSkip: false,
          maxTicksLimit: selectedTime.value === '1D' ? 12 :
                         selectedTime.value === '7D' ? 15 :
                         selectedTime.value === '1M' ? 16 :
                         selectedTime.value === '3M' ? 14 : undefined,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value: string | number | Date) {
            const date = new Date(value)

            const formatMonth = (d: Date) => {
              const month = d.toLocaleDateString('es-ES', { month: 'short' })
              return month.charAt(0).toUpperCase() + month.slice(1)
            }

            if (selectedTime.value === '1Y') {
              const month = formatMonth(date)
              const year = String(date.getFullYear()).slice(-2)
              return `${month} '${year}`
            }

            if (selectedTime.value === '1M' || selectedTime.value === '7D' || selectedTime.value === '1D') {
              if (date.getHours() === 0 && date.getMinutes() === 0) {
                return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                  .replace(/^(\d{2}) (\w+)/, (_, day, month) => {
                    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
                    return `${day} ${capitalizedMonth}`
                  })
              }
              return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
            }

            if (selectedTime.value === '3M') {
              return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                .replace(/^(\d{2}) (\w+)/, (_, day, month) => {
                  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
                  return `${day} ${capitalizedMonth}`
                })
            }

            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
          }
        },
        grid: { display: false }
      },
      y: {
        beginAtZero: false,
        position: 'right',
        grid: { 
          display: true, 
          color: gridColor.value
        },
        ticks: {
          padding: 10,
          callback: (value: number) => {
            if (selectedType.value === 'Market cap') {
              return storeUserPreferences.convertToAbbreviated(value, storeUserPreferences.selectedCurrency)
            } else {
              return storeUserPreferences.convertPrice(value, storeUserPreferences.selectedCurrency)
            }
          }
        },
        afterDataLimits: (scale: { min: number; max: number }) => {
          const chart = storeCryptos.chartsCryptos
          if (!chart) return

          const chartData = storeCryptos.chartsCryptos as unknown as CryptoChartData
          const data = selectedType.value === 'Market cap'
            ? chartData.market_caps
            : chartData.prices

          if (!data?.length) return

          const values = data.map(([_, y]) => y)
          const min = Math.min(...values)
          const max = Math.max(...values)
          const padding = (max - min) * 0.1

          scale.min = min - padding
          scale.max = max + padding
        }
      }
    },
  }
})
</script>

<template>
  <div class="main-container">
    <div class="chart-btn-content">
      <div class="chart-btn">
        <button
          class="chart-btn-value"
          :class="{ selected: selectedType === 'Price' }"
          @click="selectType('Price')"
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
    </div>

    <div class="crypto-chart">
      <Line v-if="!isLoading" :data="chartData" />
      <span v-else :style="{ color: textColor }">{{ t('AssetChart_Loading') }}</span>
    </div>
    
    <div v-if="props.cryptoDetails?.description?.en" class="description-container">
      <p class="description-title">
        {{ t('AssetChart_Title_1') }} 
        {{ props.cryptoDetails.name }}
        ({{ props.cryptoDetails.symbol.toUpperCase() }}){{ t('AssetChart_Title_2') }}  
      </p>
      <p class="description-text">{{ props.cryptoDetails.description?.en }}</p>
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
  color: var(--gray-color);
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
	background-color: v-bind(backgroundTable) !important;
  border: solid 1px var(--dark-gray-color);
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