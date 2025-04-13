<script setup lang="ts">
import { useCryptosStore } from '@/stores/cryptos'
import { ref, onMounted, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps<{ cryptoId: string }>()

const storeCryptos = useCryptosStore()
const isLoading = ref(true)

onMounted(async () => {
  await storeCryptos.GetCryptoCharts(props.cryptoId, 1)
  isLoading.value = false
})

const chartData = computed(() => {
  const chart = storeCryptos.chartsCryptos

  if (!chart || !Array.isArray(chart.prices) || chart.prices.length === 0) {
    return {
      labels: [],
      datasets: [],
    }
  }

  const prices = chart.prices

  return {
    labels: prices.map((item: number[]) =>
      new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'Precio (USD)',
        data: prices.map((item: number[]) => item[1]),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
}
</script>

<template>
	<div class="crypto-chart">
		<p>Gráfica de Precio - {{props.cryptoId}} (últimas 24h)</p>
		<Line v-if="!isLoading" :data="chartData" :options="chartOptions" />
		<p v-else>Cargando datos...</p>
	</div>
</template>
  
  <style scoped>
.crypto-chart {
	background-color: #f0f0f0 !important;
	width: 50vw;
	
}

  </style>