<script setup lang="ts">
import { computed } from "vue";
import { useStocksStore } from '@/stores/stocks'
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundTableColor = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const storestocks = useStocksStore()

//storestocks.GetStocksLosers()
</script>

<template>
      <v-table class="table-container">
        <thead>
          <tr>
            <th class="text-left" colspan="2">
              <v-icon class="mb-2" color="red">mdi mdi-water</v-icon> 
              <span class="title-table">{{ t('StocksLosersTable_Title') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="stocks in storestocks.losersStocks.slice(0, 5)"
            :key="stocks.ticker"
          >
            <td>
              {{ stocks.companyName }}
            </td>
            <td class="stock-info">
              <span class="table-price">
                {{ storeUserPreferences.convertPrice(stocks.price, storeUserPreferences.selectedCurrency, 'after') }}
              </span>
              <span class="table-change">
                <span 
                  :style="{ color: storeUserPreferences.getPriceColor(stocks.changesPercentage) }">
                  {{ parseFloat(stocks.changesPercentage).toFixed(2) }}%
                </span>
                <v-icon 
                  :color="storeUserPreferences.getPriceColor(stocks.changesPercentage)">
                  {{ storeUserPreferences.getArrowDirection(stocks.changesPercentage) }}
                </v-icon>
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
</template>

<style scoped>
.table-container {
  background-color: v-bind(backgroundTableColor);
  color: v-bind(textColor);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
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
  margin-right: 20px;
}

.table-change {
  display: flex;
  align-items: center;
}

</style>

