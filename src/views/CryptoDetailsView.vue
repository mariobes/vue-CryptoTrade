<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import CryptoInfoTable from '@/components/Crypto/CryptoInfoTable.vue'
import CryptoCharts from '@/components/Crypto/CryptoCharts.vue'
import TransactionsAsset from '@/components/Transaction/TransactionsAsset.vue'
import PositionsAsset from '@/components/Transaction/PositionsAsset.vue'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeCryptos = useCryptosStore()
const storeUserPreferences = useUserPreferencesStore()

const cryptoDetails = computed(() => storeCryptos.cryptoDetails)

const route = useRoute()
const cryptoId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})
</script>

<template>
	<div class="main-container">
		<CryptoInfoTable class="container-details" :cryptoId="cryptoId" :key="cryptoId"></CryptoInfoTable>
		<CryptoCharts class="container-chart" :cryptoId="cryptoId" :cryptoDetails="cryptoDetails" :key="cryptoId"></CryptoCharts>
		<div class="container-transactions">
			<TransactionsAsset :assetId="cryptoId" :key="cryptoId" :typeOfAsset="'Crypto'"></TransactionsAsset>
			<PositionsAsset :assetId="cryptoId" :key="cryptoId" :typeOfAsset="'Crypto'"></PositionsAsset>
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

/* Responsive */
@media (max-width: 1800px) {
  .container-transactions {
    display: none;
  }

	.container-chart {
		width: 75vw;
	}
}

@media (max-width: 1550px) {
	.container-details {
		width: 30vw;
	}

	.container-chart {
		width: 70vw;
	}
}

@media (max-width: 1300px) {
	.container-details {
		width: 40vw;
	}

	.container-chart {
		width: 60vw;
	}
}

@media (max-width: 950px) {
	.main-container {
		flex-direction: column;
	}

	.container-details {
		width: 100vw;
	}

	.container-chart {
		width: 90vw;
	}
}
</style>