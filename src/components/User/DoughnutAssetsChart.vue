<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import type { UserAssetsSummary } from '@/core/transaction'
import { useI18n } from 'vue-i18n'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js'
import type { PropType } from 'vue'

const { t } = useI18n()

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

const props = defineProps({
  assets: {
    type: Array as PropType<UserAssetsSummary[]>,
    required: true
  }
})

const chartData = computed(() => {
  const sortedAssets = [...props.assets].sort((a, b) => b.walletPercentage - a.walletPercentage)

  const topAssets = sortedAssets.slice(0, 7)
  const otherAssets = sortedAssets.slice(7)

  const data = topAssets.map(a => a.walletPercentage.toFixed(2))
  const labels = topAssets.map(a => a.symbol.toUpperCase() + '   ' + a.walletPercentage.toFixed(2) + '%')
  const backgroundColors = [
    '#1F75FE', '#4CAF50', '#FFCE56', '#FF8C00',
    '#5bc0de', '#9966FF', '#FF6384'
  ]

  if (otherAssets.length > 0) {
    const othersTotal = otherAssets.reduce((acc, a) => acc + a.walletPercentage, 0)
    data.push(othersTotal.toString())
    labels.push('Otros')
    backgroundColors.push('#CCCCCC')
  }

  return {
    labels,
    datasets: [{
      data,
      backgroundColor: backgroundColors,
      borderWidth: 0
    }]
  }
})

const chartOptions = {
  responsive: true,
  cutout: '75%',
  layout: {
    padding: {
			top: 60,
      bottom: 50
    }
  },
  plugins: {
    legend: {
			display: false,
    },
		tooltip: {
			callbacks: {
				title: (context: any) => {
					return context[0].label.split(' ')[0]
				},
				label: () => {
					return ''
				}
			}
  	}
  }
}
</script>

<template>
  <div v-if="chartData.datasets[0].data.length > 0" class="chart-container">
		<div class="chart-title">{{ t('UserInfo_Chart_Title') }}</div>
		<div class="chart-content">
			<Doughnut :data="chartData" :options="chartOptions" />
		</div>

		<div class="legend-container">
			<ul>
				<li v-for="(label, i) in chartData.labels" :key="i">
					<span
						class="legend-dot"
						:style="{ backgroundColor: chartData.datasets[0].backgroundColor[i] }"
					></span>
					<div class="legend-content">
						<span class="legend-symbol">
							{{ label.split('   ')[0] }}
						</span>
						<span class="legend-percentage">
							{{ Number(chartData.datasets[0].data[i]).toFixed(2) }}%
						</span>
					</div>
				</li>
			</ul>
		</div>

  </div>
  <div v-else>
    {{ t('UserInfo_Chart_Text') }}
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
	display: flex;
}

.chart-title {
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 1.25rem;
  font-weight: bold;
}

.chart-content {
  width: 300px;
}

.legend-container {
  margin-top: 20px;
	font-weight: bold;
}

.legend-container li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
	min-width: 150px;
}

.legend-dot {
  height: 12px;
  width: 14px;
  border-radius: 50%;
  margin-right: 10px;
}

.legend-content {
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.legend-symbol {
	font-size: 0.95rem;
}

.legend-percentage {
	font-size: 0.95rem;
}
</style>