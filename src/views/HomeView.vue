<script setup lang="ts">
import CryptoIndices from '@/components/CryptoIndices.vue'
import CryptosTrendingTable from '@/components/CryptosTrendingTable.vue'
import StocksTrendingTable from '@/components/StocksTrendingTable.vue'
import CryptoTable from '@/components/CryptoTable.vue'
// import StockTable from '@/components/StockTable.vue'
</script>

<template>

  <div class="main-container">
    <div class="title-container">
      <p class="title-text">Resumen de los mercados</p>
    </div>
    <div class="content-container"> 
      <CryptoIndices class="content-item"></CryptoIndices>
      <CryptosTrendingTable class="content-item"></CryptosTrendingTable>
      <StocksTrendingTable class="content-item"></StocksTrendingTable>
    </div>

    <CryptoTable></CryptoTable>
    <!-- <StockTable></StockTable> -->
  </div>
</template>

<style scoped>
/* :deep(.table th),
:deep(.table td) {
  border: none !important;
} */

.main-container {
  max-width: 65vw;
  margin: 0 auto;
}

.title-container {
  margin: 50px 0;
}

.title-text {
  font-size: 2rem;
  color: white;
}

.content-container {
  display: flex;
}

.content-item {
  width: 100%;
}

.content-item:not(:last-child) {
  margin-right:30px;
}

</style>
