<script setup lang="ts">
import { ref } from 'vue'
import { useCryptosStore } from '@/stores/cryptos'

const storeCryptos = useCryptosStore()

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
    // await storeCryptos.GetCryptosApi();
    console.log("(Crypto) Base de datos actualizada exitosamente.");
  }
  else {
    console.log("(Crypto) La base de datos ya esta actualizada.");
  }
};

updateCryptoDatabase();

storeCryptos.GetAllCryptos(sortBy.value, order.value) 
</script>

<template>
  <div class="title-container">
    <p class="title-text">Principales Criptomonedas por capitalización de mercado</p>
  </div>
  <v-table class="table-container">
    <thead>
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Precio
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="crypto in storeCryptos.cryptos.splice(0, 10)"
        :key="crypto.id"
      >
        <td>{{ crypto.name }}</td>
        <td>{{ crypto.current_price }}</td>
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