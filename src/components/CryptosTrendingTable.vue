<script setup lang="ts">
import { useCryptosStore } from '@/stores/cryptos'

const storeCryptos = useCryptosStore()

storeCryptos.GetCryptosTrending()

function getPercentageColor(percentage: number) {
  return percentage > 0 ? 'green' : 'red';
}

function getArrowDirection(percentage: number) {
  return percentage > 0 ? 'mdi-menu-up' : 'mdi-menu-down';
}
</script>

<template>
      <!-- v-if="storeCryptos.trendingCryptos.length > 0" -->
      <v-table class="table-container">
        <thead>
          <tr>
            <th class="text-left" colspan="2">
              <v-icon class="mb-2" color="red">mdi-fire</v-icon> 
              <span class="title-table">Criptomonedas en tendencia</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cryptos in storeCryptos.trendingCryptos.slice(0, 5)"
            :key="cryptos.item.id"
          >
            <td>
              {{ cryptos.item.symbol }}
            </td>
            <td class="crypto-info">
              <span class="table-price">
                {{ cryptos.item.data.price.toFixed(4) }} $
              </span>
              <span class="table-change">
                <span 
                  :style="{ color: getPercentageColor(cryptos.item.data.price_change_percentage_24h.usd) }">
                  {{ cryptos.item.data.price_change_percentage_24h.usd.toFixed(2) }}%
                </span>
                <v-icon 
                  :color="getPercentageColor(cryptos.item.data.price_change_percentage_24h.usd)">
                  {{ getArrowDirection(cryptos.item.data.price_change_percentage_24h.usd) }}
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

.crypto-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.table-price {
  margin-left: 80px;
}

.table-change {
  display: flex;
  align-items: center;
}

</style>

