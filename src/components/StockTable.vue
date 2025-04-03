<script setup lang="ts">
import { ref } from 'vue'
import { useStocksStore } from '@/stores/stocks'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const storeStocks = useStocksStore()

const sortBy = ref(0)
const order = ref(0)

const setSortBy = (newSortBy: number) => {
  sortBy.value = newSortBy
  storeStocks.GetAllStocks(sortBy.value, order.value) 
}

const setOrder = () => {
  order.value = order.value === 0 ? 1 : 0
  storeStocks.GetAllStocks(sortBy.value, order.value) 
}

const updateStockDatabase = async () => {
  await storeStocks.GetStock('aapl');

  if (storeStocks.stock && new Date(storeStocks.stock.lastUpdated).toDateString() !== new Date().toDateString()) {
    await storeStocks.GetStocksApi();
    console.log("(Stock) Base de datos actualizada exitosamente.");
  }
  else {
    console.log("(Stock) La base de datos ya esta actualizada.");
  }
};

updateStockDatabase();

storeStocks.GetAllStocks(sortBy.value, order.value) 
</script>

<template>
  <div class="title-container">
    <p class="title-text">{{ t('StockTable_Title') }}</p>
  </div>
  <v-table class="table-container">
    <thead>
      <tr>
        <th class="text-left">
          {{ t('StockTable_Name') }}
        </th>
        <th class="text-left">
          {{ t('StockTable_Price') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="stock in storeStocks.stocks.slice(0, 10)"
        :key="stock.id"
      >
        <td>{{ stock.companyName }}</td>
        <td>{{ stock.price }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.title-container {
  margin: 50px 0;
}

.title-text {
  font-size: 2rem;
  color: white;
}

.table-container {

}

</style>