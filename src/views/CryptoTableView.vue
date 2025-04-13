<script setup lang="ts">
import CryptoIndices from '@/components/Crypto/CryptoIndices.vue'
import CryptosTrendingTable from '@/components/Crypto/CryptosTrendingTable.vue'
import CryptosGainersTable from '@/components/Crypto/CryptosGainersTable.vue'
import CryptosLosersTable from '@/components/Crypto/CryptosLosersTable.vue'
import CryptoTable from '@/components/Crypto/CryptoTable.vue'

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
