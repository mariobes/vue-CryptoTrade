<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import CryptoInfoTable from '@/components/Crypto/CryptoInfoTable.vue'
import CryptoCharts from '@/components/Crypto/CryptoCharts.vue'
import TransactionComponent from '@/components/Transaction/TransactionComponent.vue'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeCryptos = useCryptosStore()
const storeUserPreferences = useUserPreferencesStore()

const cryptoDetails = computed(() => storeCryptos.cryptoDetails)

const route = useRoute()
const cryptoId = computed(() => route.params.id)


</script>

<template>
	<div class="main-container">
		<CryptoInfoTable class="container-details" :cryptoId="cryptoId" :key="cryptoId"></CryptoInfoTable>
		<CryptoCharts class="container-chart" :cryptoId="cryptoId" :cryptoDetails="cryptoDetails" :key="cryptoId"></CryptoCharts>
		<TransactionComponent class="container-transactions"></TransactionComponent>
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
	border-right: solid 1px #80808050;
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
	border-left: solid 1px #80808050;
}


</style>