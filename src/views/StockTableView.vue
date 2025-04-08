<script setup lang="ts">
import StocksTrendingTable from '@/components/StocksTrendingTable.vue'
import StockTable from '@/components/StockTable.vue'

</script>

<template>

  <div class="main-container">
    <div class="content-container"> 
      <StocksTrendingTable class="content-item"></StocksTrendingTable>
      <StocksTrendingTable class="content-item"></StocksTrendingTable>
      <StocksTrendingTable class="content-item"></StocksTrendingTable>
      <StocksTrendingTable class="content-item"></StocksTrendingTable>
    </div>

    <StockTable></StockTable>
  </div>
</template>

<style scoped>
.main-container {
  max-width:97vw;
  margin: 0 auto;
}

.content-container {
  display: flex;
  margin: 30px 0;
}

.content-item {
  width: 100%;
}

.content-item:not(:last-child) {
  margin-right:15px;
}

</style>
