<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps<{
  prices: number[]
}>()

const chartColor = computed(() => {
  if (!props.prices || props.prices.length < 2) return 'gray'
  return props.prices[0] < props.prices[props.prices.length - 1] ? 'green' : 'red'
})

const data = computed(() => ({
  labels: props.prices.map((_, index) => index),
  datasets: [
    {
      data: props.prices,
      borderColor: chartColor.value,
      backgroundColor: 'transparent',
      pointRadius: 0,
      tension: 0.3
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderWidth: 2
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      display: false
    }
  }
}
</script>

<template>
  <div class="crypto-sparkline">
    <Line :data="data" :options="options" />
  </div>
</template>

<style scoped>
.crypto-sparkline {
  width: 120px;
  height: 60px;
  margin-left: auto;
}

</style>
