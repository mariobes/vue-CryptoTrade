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
        class="stock-link"
        :class="storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'"
        @click="$router.push({ name: 'stockDetails', params: { id: stocks.ticker } })"
        style="cursor: pointer"
      >
        <td>
          <div class="table-content-name">
            <img :src="stocks.image" alt="Stock Logo" class="stock-image" />
            <span class="stock-name mt-1">{{ stocks.companyName }}</span>
          </div>
        </td>
        <td>
          <div class="table-content-price">
            <span class="stock-price">
              {{ storeUserPreferences.convertPrice(stocks.price, storeUserPreferences.selectedCurrency, 'after') }}
            </span>
            <span class="stock-change">
              <span 
                :style="{ color: storeUserPreferences.getPriceColor(stocks.changesPercentage) }">
                {{ parseFloat(stocks.changesPercentage).toFixed(2) }}%
              </span>
              <v-icon 
                :color="storeUserPreferences.getPriceColor(stocks.changesPercentage)">
                {{ storeUserPreferences.getArrowDirection(stocks.changesPercentage) }}
              </v-icon>
            </span>
          </div>
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

.stock-link {
  text-decoration: none;
  color: inherit;
}

.hover-light:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.hover-dark:hover {
  background-color: #444343 !important;
}

.table-content-name {
  display: flex;
  align-items: center;
}

.stock-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}

.stock-name {
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.table-content-price {
  display: flex;
  justify-content: end;
  align-items: center;
  white-space: nowrap;
}

.stock-price {
  margin-right: 30px;
}

.stock-change {
  display: flex;
  align-items: center;
  max-width: 58px;
  justify-content: end;
}

</style>

