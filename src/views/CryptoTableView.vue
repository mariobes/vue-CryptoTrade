<script setup lang="ts">
import CryptoIndices from '@/components/CryptoIndices.vue'
import CryptosTrendingTable from '@/components/CryptosTrendingTable.vue'
import CryptosGainersTable from '@/components/CryptosGainersTable.vue'
import CryptosLosersTable from '@/components/CryptosLosersTable.vue'
import CryptoTable from '@/components/CryptoTable.vue'

</script>

<template>

  <div class="main-container">
    <div class="content-container"> 
      <CryptoIndices class="content-item"></CryptoIndices>
      <CryptosTrendingTable class="content-item"></CryptosTrendingTable>
      <CryptosGainersTable class="content-item"></CryptosGainersTable>
      <CryptosLosersTable class="content-item"></CryptosLosersTable>
    </div>

    <CryptoTable></CryptoTable>
  </div>
</template>

<style scoped>
.main-container {
  max-width:97vw;
  margin: 0 auto;
}

.content-container {
  display: flex;
  margin: 30px 0;
}

.content-item {
  width: 100%;
}

.content-item:not(:last-child) {
  margin-right:15px;
}

</style>
