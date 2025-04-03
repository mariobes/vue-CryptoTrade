<script setup lang="ts">
import { useStocksStore } from '@/stores/stocks'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const storeStocks = useStocksStore()

// storeStocks.GetStocksTrending()

function getPercentageColor(percentage: number) {
  return percentage > 0 ? 'green' : 'red';
}

function getArrowDirection(percentage: number) {
  return percentage > 0 ? 'mdi-menu-up' : 'mdi-menu-down';
}
</script>

<template>
      <v-table class="table-container">
        <thead>
          <tr>
            <th class="text-left" colspan="2">
              <v-icon class="mb-2" color="red">mdi-fire</v-icon> 
              <span class="title-table">{{ t('StocksTrendingTable_Title') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stocks in storeStocks.trendingStocks.slice(0, 5)"
            :key="stocks.ticker"
          >
            <td>
              <!-- {{ stocks.image }} -->
              {{ stocks.ticker }}
            </td>
            <td class="stock-info">
              <span class="table-price">
                {{ stocks.price }} $
              </span>
              <span class="table-change">
                <span 
                  :style="{ color: getPercentageColor(stocks.changesPercentage) }">
                  {{ parseInt(stocks.changesPercentage).toFixed(2) }}%
                </span>
                <v-icon 
                  :color="getPercentageColor(stocks.changesPercentage)">
                  {{ getArrowDirection(stocks.changesPercentage) }}
                </v-icon>
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
</template>

<style scoped>
.table-container {
  background-color: #8080802a;
  color: white;
  border-radius: 20px;
  padding: 10px;
}

.title-table {
  margin-left: 8px;
  font-size: 1.2rem;
  font-weight: bold;
}

.stock-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.table-price {
  margin-left: 50px;
}

.table-change {
  display: flex;
  align-items: center;
}

</style>

