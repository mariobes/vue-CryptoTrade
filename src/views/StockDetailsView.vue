<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import StockInfoTable from '@/components/Stock/StockInfoTable.vue'
import StockCharts from '@/components/Stock/StockCharts.vue'
import TransactionsAsset from '@/components/Transaction/TransactionsAsset.vue'
import PositionsAsset from '@/components/Transaction/PositionsAsset.vue'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const route = useRoute()
const stockId = computed(() => route.params.id)


</script>

<template>
	<div class="main-container">
		<StockInfoTable class="container-details" :stockId="stockId" :key="stockId"></StockInfoTable>
		<StockCharts class="container-chart" :stockId="stockId" :key="stockId"></StockCharts>
		<div class="container-transactions">
			<TransactionsAsset :assetId="stockId" :key="stockId" :typeOfAsset="'Stock'"></TransactionsAsset>
			<PositionsAsset :assetId="stockId" :key="stockId" :typeOfAsset="'Stock'"></PositionsAsset>
		</div>
	</div>
</template>

<style scoped>
.main-container {
	display: flex;
	overflow: hidden;
}

.container-details {
	width: 25vw;
	color: v-bind(textColor);
	border-right: solid 1px var(--dark-gray-color);
}

.container-chart {
	width: 55vw;
	overflow-y: auto;
	scroll-behavior: smooth;
	scrollbar-width: none;
	-ms-overflow-style: none;
	max-height: 90vh;
}

.container-transactions {
	width: 20vw;
	color: v-bind(textColor);
	border-left: solid 1px var(--dark-gray-color);
}
</style>