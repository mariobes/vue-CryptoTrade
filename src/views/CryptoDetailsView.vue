<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import CryptoInfoTable from '@/components/Crypto/CryptoInfoTable.vue'
import CryptoCharts from '@/components/Crypto/CryptoCharts.vue'
import TransactionComponent from '@/components/Transaction/TransactionComponent.vue'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const route = useRoute()
const cryptoId = computed(() => route.params.id)


</script>

<template>
	<div class="main-container">
		<CryptoInfoTable class="container-details" :cryptoId="cryptoId" :key="cryptoId"></CryptoInfoTable>
		<CryptoCharts class="container-chart" :cryptoId="cryptoId" :key="cryptoId"></CryptoCharts>
		<TransactionComponent class="container-transactions"></TransactionComponent>
	</div>
</template>

<style scoped>
.main-container {
	display: flex;
}

.container-details {
	width: 25vw;
	color: v-bind(textColor);
	border-right: solid 1px #80808050;
	height: 100vh;
}

.container-chart {
	width: 50vw;
	border-bottom: solid 1px #80808050;
	height: 50vh;
}

.container-transactions {
	width: 25vw;
	color: v-bind(textColor);
	border-left: solid 1px #80808050;
	height: 100vh;
}


</style>