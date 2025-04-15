<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const stockId = computed(() => route.params.id)

</script>

<template>

<div>Detalles de la acción {{ stockId }}</div>
<!-- <StockCharts :stockId="stockId" :key="stockId" /> -->

</template>

<style scoped>

</style>