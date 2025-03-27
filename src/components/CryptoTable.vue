<script setup lang="ts">
import { ref } from 'vue'
import { useCryptosStore } from '@/stores/cryptos'

const { GetAllCryptos } = useCryptosStore()

const storeCryptos = useCryptosStore()

const sortBy = ref(0)
const order = ref(0)

const setSortBy = (newSortBy: number) => {
  sortBy.value = newSortBy
  GetAllCryptos(sortBy.value, order.value) 
}

const setOrder = () => {
  order.value = order.value === 0 ? 1 : 0
  GetAllCryptos(sortBy.value, order.value) 
}

GetAllCryptos(sortBy.value, order.value) 
</script>

<template>
  <v-table>
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
        v-for="crypto in storeCryptos.cryptos"
        :key="crypto.id"
      >
        <td>{{ crypto.name }}</td>
        <td>{{ crypto.current_price }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>

</style>