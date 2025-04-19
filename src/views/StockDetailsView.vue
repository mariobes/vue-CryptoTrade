<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserPreferencesStore } from '@/stores/userPreferences'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const route = useRoute()
const stockId = computed(() => route.params.id)


</script>

<template>

<div :style="{ color: textColor }">Detalles de la acción {{ stockId }}</div>
<!-- <StockCharts :stockId="stockId" :key="stockId" /> -->

</template>

<style scoped>

</style>