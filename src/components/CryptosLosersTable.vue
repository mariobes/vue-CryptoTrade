<script setup lang="ts">
import { computed } from "vue";
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundTableColor = computed(() => storeUserPreferences.getTheme().background_table)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const storeCryptos = useCryptosStore()

storeCryptos.GetCryptosLosers()

function getPercentageColor(percentage: number) {
  return percentage > 0 ? 'green' : 'red';
}

function getArrowDirection(percentage: number) {
  return percentage > 0 ? 'mdi-menu-up' : 'mdi-menu-down';
}

const getConvertedPrice = (price: number): string => {
  return storeUserPreferences.convertFromUSD(price, storeUserPreferences.selectedCurrency)
}
</script>

<template>
      <v-table class="table-container">
        <thead>
          <tr>
            <th class="text-left" colspan="2">
              <v-icon class="mb-2" color="red">mdi mdi-water</v-icon> 
              <span class="title-table">{{ t('CryptosLosersTable_Title') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cryptos in storeCryptos.losersCryptos.slice(0, 5)"
            :key="cryptos.id"
          >
            <td>
              {{ cryptos.name }}
            </td>
            <td class="crypto-info">
              <span class="table-price">
                {{ getConvertedPrice(cryptos.current_price) }}
              </span>
              <span class="table-change">
                <span 
                  :style="{ color: getPercentageColor(cryptos.price_change_percentage_7d_in_currency) }">
                  {{ cryptos.price_change_percentage_7d_in_currency.toFixed(2) }}%
                </span>
                <v-icon 
                  :color="getPercentageColor(cryptos.price_change_percentage_7d_in_currency)">
                  {{ getArrowDirection(cryptos.price_change_percentage_7d_in_currency) }}
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

.crypto-info {
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

