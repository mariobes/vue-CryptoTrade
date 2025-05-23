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

storeCryptos.GetCryptosGainers()
</script>

<template>
  <v-table class="table-container">
    <thead>
      <tr>
        <th class="text-left" colspan="2">
          <v-icon class="mb-2" color="green">mdi-chart-line-variant</v-icon> 
          <span class="title-table">{{ t('CryptosGainersTable_Title') }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="crypto in storeCryptos.gainersCryptos.slice(0, 5)"
        :key="crypto.id"
        :class="storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'"
        @click="$router.push({ name: 'cryptoDetails', params: { id: crypto.id } })"
        style="cursor: pointer"
      >
        <td>
          <div class="table-content-name">
            <img :src="crypto.image" alt="Crypto Logo" class="crypto-image" @error="storeUserPreferences.showDefaultAssetImage(crypto)" />
            <span class="crypto-name mt-1">{{ crypto.name }}</span>
          </div>
        </td>
        <td>
          <div class="table-content-price">
            <span class="crypto-price">
              {{ storeUserPreferences.convertPrice(crypto.current_price, storeUserPreferences.selectedCurrency, 'after') }}
            </span>
            <span class="crypto-change" :style="{ color: storeUserPreferences.getPriceColor(crypto.price_change_percentage_7d_in_currency) }">
              <v-icon>
                {{ storeUserPreferences.getArrowDirection(crypto.price_change_percentage_7d_in_currency) }}
              </v-icon>
              <span>
                {{ Math.abs(crypto.price_change_percentage_7d_in_currency).toFixed(2) }}%
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
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.336);
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

.crypto-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}

.crypto-name {
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

.crypto-price {
  margin-right: 30px;
}

.crypto-change {
  display: flex;
  align-items: center;
  max-width: 58px;
  justify-content: end;
}
</style>

