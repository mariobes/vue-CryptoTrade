<script setup lang="ts">
import { ref } from 'vue'
import { useCryptosStore } from '@/stores/cryptos'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const storeCryptos = useCryptosStore()
const storeUserPreferences = useUserPreferencesStore()

const sortBy = ref(0)
const order = ref(0)

const setSortBy = (newSortBy: number) => {
  sortBy.value = newSortBy
  storeCryptos.GetAllCryptos(sortBy.value, order.value) 
}

const setOrder = () => {
  order.value = order.value === 0 ? 1 : 0
  storeCryptos.GetAllCryptos(sortBy.value, order.value) 
}

const updateCryptoDatabase = async () => {
  await storeCryptos.GetCrypto('bitcoin');

  if (storeCryptos.crypto && new Date(storeCryptos.crypto.lastUpdated).toDateString() !== new Date().toDateString()) {
    await storeCryptos.GetCryptosApi();
  }
};

updateCryptoDatabase();

storeCryptos.GetAllCryptos(sortBy.value, order.value) 

const getConvertedPrice = (price: number): string => {
  return storeUserPreferences.convertFromUSD(price, storeUserPreferences.selectedCurrency)
}

</script>

<template>
  <div class="title-container">
    <p class="title-text">{{ t('CryptoTable_Title') }}</p>
  </div>
  <v-table class="table-container">
    <thead>
      <tr>
        <th class="text-left">
          {{ t('CryptoTable_Name') }}
        </th>
        <th class="text-left">
          {{ t('CryptoTable_Price') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="crypto in storeCryptos.cryptos.slice(0, 10)"
        :key="crypto.id"
      >
        <td>{{ crypto.name }}</td>
        <td>{{ getConvertedPrice(crypto.current_price) }}</td>
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