<script setup lang="ts">
import { computed } from "vue";
import { useMarketsStore } from '@/stores/markets'
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundTableColor = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()
const storeMarkets = useMarketsStore()

const { t } = useI18n()

storeMarkets.GetStocksLosers()
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
        v-for="stock in storeMarkets.stocksLosers.slice(0, 5)"
        :key="stock.id"
        :class="storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'"
        @click="$router.push({ name: 'stockDetails', params: { id: stock.id } })"
        style="cursor: pointer"
      >
        <td>
          <div class="table-content-name">
            <img :src="stock.image" alt="Stock Logo" 
              @error="storeUserPreferences.showDefaultAssetImage(stock)" 
              class="stock-image" 
              :class="{ 'stock-image-light': storeUserPreferences.selectedTheme === 'light' }"
            />
            <span class="stock-name mt-1">{{ stock.name }}</span>
          </div>
        </td>
        <td>
          <div class="table-content-price">
            <span class="stock-price">
              {{ storeUserPreferences.convertPrice(stock.price, storeUserPreferences.selectedCurrency, 'after') }}
            </span>
            <span class="stock-change" :style="{ color: storeUserPreferences.getPriceColor(stock.changePercentage) }">
              <v-icon>
                {{ storeUserPreferences.getArrowDirection(stock.changePercentage) }}
              </v-icon>
              <span>
                {{ Math.abs(stock.changePercentage).toFixed(2) }}%
              </span>
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

.hover-light:hover {
  background-color: var(--table-market-color-hover-light) !important;
}

.hover-dark:hover {
  background-color: var(--table-market-color-hover-dark) !important;
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

.stock-image-light {
  background-color: var(--background-stock-image);
  border: solid 1px var(--background-stock-image);
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

