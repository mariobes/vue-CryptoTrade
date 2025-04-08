<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const cryptoId = route.params.id

</script>

<template>

<div>Detalles de la criptomoneda {{ cryptoId }}</div>

</template>

<style scoped>

</style>