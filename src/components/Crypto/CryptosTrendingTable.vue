<script setup lang="ts">
import { computed } from "vue";
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundTableColor = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const storeCryptos = useCryptosStore()

storeCryptos.GetCryptosTrending()
</script>

<template>
      <!-- v-if="storeCryptos.trendingCryptos.length > 0" -->
      <v-table class="table-container">
        <thead>
          <tr>
            <th class="text-left" colspan="2">
              <v-icon class="mb-2" color="#FF8C00">mdi-fire</v-icon> 
              <span class="title-table">{{ t('CryptosTrendingTable_Title') }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cryptos in storeCryptos.trendingCryptos.slice(0, 5)"
            :key="cryptos.item.id"
          >
            <td>
              {{ cryptos.item.name }}
            </td>
            <td class="crypto-info">
              <span class="table-price">
                {{ storeUserPreferences.convertPrice(cryptos.item.data.price, storeUserPreferences.selectedCurrency, 'after') }}
              </span>
              <span class="table-change">
                <span 
                  :style="{ color: storeUserPreferences.getPriceColor(cryptos.item.data.price_change_percentage_24h.usd) }">
                  {{ cryptos.item.data.price_change_percentage_24h.usd.toFixed(2) }}%
                </span>
                <v-icon 
                  :color="storeUserPreferences.getPriceColor(cryptos.item.data.price_change_percentage_24h.usd)">
                  {{ storeUserPreferences.getArrowDirection(cryptos.item.data.price_change_percentage_24h.usd) }}
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
  margin-left: 20px;
}

.table-change {
  display: flex;
  align-items: center;
}

</style>

