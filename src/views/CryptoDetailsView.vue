<script setup lang="ts">
import { useRoute } from 'vue-router'
import CryptoCharts from '@/components/Crypto/CryptoCharts.vue'

const route = useRoute()
const cryptoId = route.params.id


</script>

<template>

<CryptoCharts :cryptoId="cryptoId" :key="cryptoId" />

</template>

<style scoped>

</style>