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
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const props = defineProps<{
  stockId: string
}>()

const storeStocks = useStocksStore()
const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const selectedType = ref('Price')
const selectedTime = ref('1D')
const isLoading = ref(true)

const timeToDays = {
  '1D': '1min',
  '7D': '5min',
  '1M': '30min',
  '3M': '1hour',
  '5Y': '1day',
} as const

const fetchChartData = async () => {
  isLoading.value = true
  const days = timeToDays[selectedTime.value as keyof typeof timeToDays].toString() ?? 1
  await storeStocks.GetStockCharts(props.stockId, days)
  isLoading.value = false
}

onMounted(fetchChartData)
watch(selectedTime, fetchChartData)

const selectType = (type: string) => selectedType.value = type
const selectTime = (time: string) => selectedTime.value = time

const chartData = computed(() => {
  const chart = storeStocks.chartsStocks
  if (!chart || !chart.prices?.length) return { labels: [], datasets: [] }

  const isVolume = selectedType.value === 'Volume'
  const rawData = isVolume ? chart.volumes : chart.prices
  const baseline = chart.prices[0][1]

  if (isVolume) {
    return {
      datasets: [{
        label: 'Volume',
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
  let segment = []
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

function createSegment(data, color, baseline) {
  const isGreen = color === 'green'
  return {
    data,
    borderColor: isGreen ? '#4ade80' : '#ef4444',
    backgroundColor: (ctx) => createGradient(ctx, color),
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

function createGradient(ctx, color) {
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
  const chart = storeStocks.chartsStocks
  if (!chart?.prices?.length) return {}

  const first = new Date(chart.prices[0][0])
  const last = new Date(chart.prices[chart.prices.length - 1][0])

  // Hora de inicio: 11:30 AM
  const startHour = new Date(first)
  startHour.setHours(11, 30, 0, 0) // 11:30 AM

  // Hora de finalización: 18:00 PM
  const endHour = new Date(first)
  endHour.setHours(18, 0, 0, 0) // 18:00 PM

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
          title: (context) => {
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
          label: (context) => {
            const isVolume = selectedType.value === 'Volume'
            const value = context.parsed.y
            let price
            if (isVolume) {
              price = storeUserPreferences.convertToAbbreviated(value, storeUserPreferences.selectedCurrency, 'after')
              return `${t('AssetChart_Volume')}: ${price}`
            } else {
              price = storeUserPreferences.convertPrice(value, storeUserPreferences.selectedCurrency, 'after')
              return `${t('AssetChart_Price')}: ${price}`
            }  
          },
        }
      },
      legend: { display: false },
      annotation: {
        annotations: selectedType.value !== 'Volume' ? {
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
          volumeLabel: {
            type: 'label',
            xValue: chart.volumes[chart.volumes.length - 1][0],
            yValue: chart.volumes[chart.volumes.length - 1][1],
            backgroundColor: '#3b82f6',
            color: 'white',
            content: [
              storeUserPreferences.convertToAbbreviated(chart.volumes[chart.volumes.length - 1][1], storeUserPreferences.selectedCurrency)
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
        min: selectedTime.value === '1D' ? startHour.getTime() : first.getTime(),
        max: selectedTime.value === '1D' ? endHour.getTime() : last.getTime(),
        time: {
          unit: selectedTime.value === '1M' ? 'day' :
                selectedTime.value === '3M' ? 'day' : 'hour',
          stepSize: selectedTime.value === '1D' ? 2 :
                    selectedTime.value === '7D' ? 12 :
                    selectedTime.value === '3M' ? 14 : 1,
          tooltipFormat: selectedTime.value === '1M' ? 'dd MMM' :
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
          callback: function (value) {
            const date = new Date(value)

            const formatMonth = (d: Date) => {
              const month = d.toLocaleDateString('es-ES', { month: 'short' })
              return month.charAt(0).toUpperCase() + month.slice(1)
            }

            if (selectedTime.value === '5Y') {
              const month = formatMonth(date)
              const year = String(date.getFullYear()).slice(-2)
              return `${month} '${year}`
            }

            if (selectedTime.value === '1M' || selectedTime.value === '7D' || selectedTime.value === '1D') {
              // Si la hora es 00:00, mostrar solo día y mes
              if (date.getHours() === 0 && date.getMinutes() === 0) {
                return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                  .replace(/^(\d{2}) (\w+)/, (_, day, month) => {
                    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
                    return `${day} ${capitalizedMonth}`
                  })
              }
              // Si no es 00:00, mostrar hora y minutos
              return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
            }

            if (selectedTime.value === '3M') {
              // Para 3M, mostramos solo día y mes
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
          callback: (value) => {
            if (selectedType.value === 'Volume') {
              return storeUserPreferences.convertToAbbreviated(value, storeUserPreferences.selectedCurrency)
            } else {
              return storeUserPreferences.convertPrice(value, storeUserPreferences.selectedCurrency)
            }
          }
        },
        afterDataLimits: (scale) => {
          const chart = storeStocks.chartsStocks
          if (!chart) return

          // Seleccionar los datos correctos según el tipo
          const data = selectedType.value === 'Volume'
            ? chart.volumes
            : chart.prices

          if (!data?.length) return

          const values = data.map(([_, y]) => y)
          const min = Math.min(...values)
          const max = Math.max(...values)
          const padding = (max - min) * 0.1  // 10% de margen

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
          :class="{ selected: selectedType === 'Volume' }"
          @click="selectType('Volume')"
        >
        {{ t('AssetChart_Volume') }}
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
          :class="{ selected: selectedTime === '5Y' }"
          @click="selectTime('5Y')"
        >
          5Y
        </button>
      </div>
    </div>
    <div class="crypto-chart">
      <Line v-if="!isLoading" :data="chartData" :options="chartOptions" />
      <span v-else :style="{ color: textColor }">{{ t('AssetChart_Loading') }}</span>
    </div>
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