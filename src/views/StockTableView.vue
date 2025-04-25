<script setup lang="ts">
import StocksTrendingTable from '@/components/Stock/StocksTrendingTable.vue'
import StockTable from '@/components/Stock/StockTable.vue'
import StocksGainersTable from '@/components/Stock/StocksGainersTable.vue';
import StocksLosersTable from '@/components/Stock/StocksLosersTable.vue';
import StocksMostActivesTable from '@/components/Stock/StocksMostActivesTable.vue';

</script>

<template>

  <div class="main-container">
    <div class="content-container"> 
      <StocksTrendingTable class="content-item"></StocksTrendingTable>
      <StocksGainersTable class="content-item"></StocksGainersTable>
      <StocksLosersTable class="content-item"></StocksLosersTable>
      <StocksMostActivesTable class="content-item"></StocksMostActivesTable>
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
