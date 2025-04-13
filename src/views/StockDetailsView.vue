<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const stockId = route.params.id

</script>

<template>

<div>Detalles de la acción {{ stockId }}</div>

</template>

<style scoped>

</style>