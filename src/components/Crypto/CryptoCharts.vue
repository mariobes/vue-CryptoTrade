<script setup lang="ts">
import { useCryptosStore } from '@/stores/cryptos'
import { ref, onMounted, computed, watch } from 'vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement, Filler } from 'chart.js'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'

const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const storeUserPreferences = useUserPreferencesStore()

const selectedType = ref('Precio')
const selectedTime = ref('1D')

const selectType = (type: string) => {
  selectedType.value = type
}

const selectTime = (time: string) => {
  selectedTime.value = time
}

const timeToDays = {
  '1D': 1,
  '7D': 7,
  '1M': 30,
  '1Y': 365,
} as const

const fetchChartData = async () => {
  isLoading.value = true
  const days = timeToDays[selectedTime.value as keyof typeof timeToDays] ?? 1
  await storeCryptos.GetCryptoCharts(props.cryptoId, days)
  isLoading.value = false
}

onMounted(fetchChartData)

// Observa cuando cambia el tiempo seleccionado
watch(selectedTime, async () => {
  await fetchChartData()
})

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, TimeScale, PointElement, Filler, annotationPlugin)

const props = defineProps<{ cryptoId: string }>()

const storeCryptos = useCryptosStore()
const isLoading = ref(true)

// const chartData = computed(() => {
//   const chart = storeCryptos.chartsCryptos

//   if (!chart || !Array.isArray(chart.prices) || chart.prices.length === 0) {
//     return {
//       labels: [],
//       datasets: [],
//     }
//   }

//   const isMarketCap = selectedType.value === 'Market cap'
//   const rawData = isMarketCap ? chart.market_caps : chart.prices
//   const baseline = chart.prices[0][1]

//   if (isMarketCap) {
//     return {
//       datasets: [
//         {
//           label: 'Market cap',
//           data: rawData.map((item: number[]) => ({
//             x: item[0],
//             y: item[1],
//           })),
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.05)',
//           borderWidth: 2,
//           pointRadius: 0,
//           pointHoverRadius: 0,
//           tension: 0,
//         },
//       ],
//     }
//   }

//   const segments = []

//   for (let i = 0; i < rawData.length - 1; i++) {
//     const [x0, y0] = rawData[i]
//     const [x1, y1] = rawData[i + 1]

//     const above0 = y0 >= baseline
//     const above1 = y1 >= baseline

//     if (above0 === above1) {
//       // Mismo lado del baseline
//       segments.push({
//         data: [
//           { x: x0, y: y0 },
//           { x: x1, y: y1 },
//         ],
//         borderColor: above0 ? '#4ade80' : '#ef4444',
//         backgroundColor: above0 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
//       })
//     } else {
//       // Cruza el baseline, calculamos el punto de cruce
//       const t = (baseline - y0) / (y1 - y0)
//       const xCross = x0 + t * (x1 - x0)

//       segments.push({
//         data: [
//           { x: x0, y: y0 },
//           { x: xCross, y: baseline },
//         ],
//         borderColor: y0 >= baseline ? '#4ade80' : '#ef4444',
//         backgroundColor: y0 >= baseline ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
//       })

//       segments.push({
//         data: [
//           { x: xCross, y: baseline },
//           { x: x1, y: y1 },
//         ],
//         borderColor: y1 >= baseline ? '#4ade80' : '#ef4444',
//         backgroundColor: y1 >= baseline ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)',
//       })
//     }
//   }

//   return {
//     datasets: segments.map(segment => ({
//       label: selectedType.value,
//       data: segment.data,
//       borderColor: segment.borderColor,
//       backgroundColor: segment.backgroundColor,
//       borderWidth: 2,
//       pointRadius: 0,
//       pointHoverRadius: 0,
//       tension: 0,
//       fill: {
//         target: {
//           value: baseline,
//         },
//         above: segment.backgroundColor,
//         below: segment.backgroundColor,
//       },
//     })),
//   }
// })

const chartData = computed(() => {
  const chart = storeCryptos.chartsCryptos

  if (!chart || !Array.isArray(chart.prices) || chart.prices.length === 0) {
    return {
      labels: [],
      datasets: [],
    }
  }

  const isMarketCap = selectedType.value === 'Market cap'
  const rawData = isMarketCap ? chart.market_caps : chart.prices
  const baseline = chart.prices[0][1]

  if (isMarketCap) {
    return {
      datasets: [
        {
          label: 'Market cap',
          data: rawData.map((item: number[]) => ({ x: item[0], y: item[1] })),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0,
        }
      ]
    }
  }

  const unifiedData = rawData.map(([x, y]: number[]) => ({ x, y }))

  return {
    datasets: [
      {
        label: selectedType.value,
        data: unifiedData,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        fill: {
          target: {
            value: baseline,
          },
          above: (ctx) => {
            const { ctx: canvasCtx, chartArea, scales } = ctx.chart
            if (!chartArea) return 'rgba(74, 222, 128, 0.2)'

            const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)')
            gradient.addColorStop(1, 'rgba(74, 222, 128, 0)')
            return gradient
          },
          below: (ctx) => {
            const { ctx: canvasCtx, chartArea, scales } = ctx.chart
            if (!chartArea) return 'rgba(239, 68, 68, 0.2)'

            const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)')
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0)')
            return gradient
          }
        },
        segment: {
          borderColor: ctx => {
            const current = ctx.p0.parsed.y
            return current >= baseline ? '#4ade80' : '#ef4444'
          },
        }
      }
    ]
  }
})

const chartOptions = computed(() => {
  const chart = storeCryptos.chartsCryptos
  if (!chart || !Array.isArray(chart.prices) || chart.prices.length === 0) {
    return {}
  }

  const firstTimestamp = chart.prices[0][0]
  const lastTimestamp = chart.prices[chart.prices.length - 1][0]

  const startDate = new Date(firstTimestamp)
  const endDate = new Date(lastTimestamp)

  if (selectedTime.value === '1D') {
    startDate.setHours(startDate.getHours(), 0, 0, 0)
  } else if (selectedTime.value === '7D') {
    startDate.setHours(startDate.getHours(), 0, 0, 0)
  }

  return {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
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
            label: { enabled: false },
          }
        } : {}
      }
    },
    scales: {
      x: {
        type: 'time',
        min: startDate.getTime(),
        max: endDate.getTime(),
        time: {
          unit: selectedTime.value === '1Y' ? 'month' : 
                selectedTime.value === '1M' ? 'day' : 'hour', // Asegúrate de que "1M" usa "day"
          stepSize: selectedTime.value === '1D' ? 2 :
                    selectedTime.value === '7D' ? 12 : 1,
          tooltipFormat: selectedTime.value === '1Y'
            ? 'MMM yyyy'
            : selectedTime.value === '1M'
              ? 'dd MMM'
              : 'HH:mm dd MMM',
          displayFormats: {
            hour: 'HH:mm',
            day: (context) => {
              if (selectedTime.value === '1D' || selectedTime.value === '7D') {
                const date = new Date(context.value)
                // Si la hora es 00:00, muestra solo día y mes
                if (date.getHours() === 0) {
                  return 'dd MMM' // Solo Día y Mes
                }
              }
              return 'HH:mm dd MMM' // Para las otras horas, muestra Hora, Día y Mes
            },
            month: 'MMM yyyy', // Formato correcto para "1Y"
          },
        },
        ticks: {
          autoSkip: false,
          maxTicksLimit:  selectedTime.value === '1D' ? 12 :
                          selectedTime.value === '7D' ? 15 :
                          selectedTime.value === '1M' ? 16 : undefined,
          maxRotation: 0,
          minRotation: 0,
          callback: function (value: any, index: number, values: any) {
            const date = new Date(value); // Usar el valor directamente como un timestamp

            const hours = date.getHours();
            const minutes = date.getMinutes();

            // Mostrar solo día y mes si es medianoche
            if (hours === 0 && minutes === 0 && (selectedTime.value === '1D' || selectedTime.value === '7D')) {
              return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
              });
            }

            // Para los intervalos "1M" y "1Y", no cambiar la hora
            if (selectedTime.value === '1M' || selectedTime.value === '1Y') {
              return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
              });
            }

            // Formato estándar: HH:mm
            return date.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
          },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: false,
        position: 'right',
        grid: { display: true },
      }
    }
  }
})

window.scrollTo({ top: 0 });
</script>

<template>
  <div class="main-container">
    <div class="chart-btn-content">
      <div class="chart-btn">
        <button
          class="chart-btn-value"
          :class="{ selected: selectedType === 'Precio' }"
          @click="selectType('Precio')"
        >
          Precio
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
          :class="{ selected: selectedTime === '1Y' }"
          @click="selectTime('1Y')"
        >
          1Y
        </button>
      </div>
    </div>
    <div class="crypto-chart">
      <Line v-if="!isLoading" :data="chartData" :options="chartOptions" />
      <p v-else>Cargando datos...</p>
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
</style>