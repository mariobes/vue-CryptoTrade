<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <v-card height="65">
    <v-toolbar extended class="header-container">
      <div>
        <RouterLink to="/">
          <img src="@/assets/logo.png" alt="Logo" class="header-logo" />
        </RouterLink>
      </div>
      <nav>
        <RouterLink to="/" class="header-title">
          Crypto Trade
        </RouterLink>
        <span class="divider-bar">|</span>
        <RouterLink to="/" class="header-component">Criptomonedas</RouterLink>
        <RouterLink to="/" class="header-component">Acciones</RouterLink>
        <RouterLink to="/" class="header-component">Exchanges</RouterLink>
      </nav>
      
      <template v-slot:append>
        <v-btn class="header-icons btn-icons">
          <v-icon>mdi-chart-pie</v-icon>
          <span class="header-icons-text">Portafolio</span> 
        </v-btn>

        <v-btn class="header-icons btn-icons">
          <v-icon>mdi-star</v-icon>
          <span class="header-icons-text">Seguimiento</span>
        </v-btn>

        <v-btn class="header-icons btn-icons">
          <v-icon>mdi-wallet</v-icon>
          <span class="header-icons-text">Billetera DeFi</span>
        </v-btn>

        <v-card-text class="header-icons">
          <v-text-field
            class="header-icons-search"
            :loading="loading"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            placeholder="Buscar"
            variant="solo"
            hide-details
            single-line
            bg-color="#ffffff99"
            rounded
            flat
            @click:append-inner="onClick"
            @keyup.enter=""
          ></v-text-field>
        </v-card-text>

        <v-btn class="header-icons icon-user btn-icons" icon>
          <v-icon>mdi-account-cog</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
  </v-card>
</template>

<style scoped>
.header-container {
  background-color: rgba(0, 0, 0, 0.95);
  height: 65px;
  position: fixed;
  border-bottom: solid 1px #80808050;
}

.header-logo {
  width: 40px;
  height: 40px;
  margin-left: 20px;
  margin-top: 5px;
}

.header-title {
  font-size: 22px;
  text-decoration: none;
  color: #ffffff;
  margin-right: 10px;
  padding-left: 10px;
}

.divider-bar {
  margin-right: 10px;
  color: #808080;
}

.header-component {
  font-size: 16px;
  text-decoration: none;
  color: #ffffff;
  margin: 0 10px;
}

.header-component:hover {
  color: #FFD700;
}

.v-btn {
  color: white;
}

.header-icons {
  font-size: 14px; 
  padding: 0 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.header-icons-text {
  font-size: 12px; 
  text-transform: none;
  padding-left: 5px;
}

.header-icons-search {
  width: 250px;
  transition: background-color 0.3s;
  border-radius: 20px;
}

.header-icons-search:hover {
  background-color: rgb(128, 121, 121);
}

.icon-user {
  font-size: 20px; 
  margin-right: 10px;
}

.btn-icons:hover {
  background-color: #ffffff22;
}

</style>