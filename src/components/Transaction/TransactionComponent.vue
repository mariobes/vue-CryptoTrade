<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useAuthStore } from '@/stores/auth'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const selectedAction = ref<'buy' | 'sell'>('buy');
const amount = ref();

</script>

<template>
  <div class="main-container">

    <div v-if="!storeAuth.isLoggedIn()" class="message-container">
      Inicia sesión o registrate para poder operar
    </div>


    <div v-if="storeAuth.isLoggedIn()" class="cash-container">
      Dinero del usuario
    </div>





    





    <div class="actions-container">
      <div class="action-btn-content">
        <button
          class="action-btn"
          :class="{ selected: selectedAction === 'buy' }"
          @click="selectedAction = 'buy'"
        >
          Comprar
        </button>
        <button
          class="action-btn"
          :class="{ selected: selectedAction === 'sell' }"
          @click="selectedAction = 'sell'"
        >
          Vender
        </button>
      </div>

      <div v-if="selectedAction" class="amount-input-container">
        <label
          v-if="storeAuth.isLoggedIn()" 
          :for="selectedAction" class="amount-input-text"
        >
          {{ selectedAction === 'buy' ? 'x dinero disponible' : 'x acciones disponibles' }}
        </label>

        <div class="amount-input-content">
          <span>Importe</span>
          <input 
          v-model="amount" 
          class="amount-input-value"
          placeholder="0" 
          :disabled="!storeAuth.isLoggedIn()"
        /></div>

        <!-- <div></div> -->

        <div class="buy-sell-btn-container">
          <button 
            :class="['buy-sell-btn', selectedAction === 'buy' ? 'buy-btn' : 'sell-btn']"
            :disabled="!storeAuth.isLoggedIn()"
          >
            {{ selectedAction === 'buy' ? 'Comprar' : 'Vender' }}
          </button>
        </div>
      </div>
    </div>






    <div v-if="!storeAuth.isLoggedIn()" class="positions-container">
      Haz tu primera compra para ver tus posiciones
    </div>

    <div v-if="storeAuth.isLoggedIn()" class="positions-container">
      Posiciones
    </div>
  </div>
</template>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
  padding: 50px;
  justify-content:space-evenly;
}

.message-container {
  
}

.cash-container {
  
}

.actions-container {
  
}

.positions-container {
  
}

.action-btn-content {
  display: flex;
  justify-content: start;
  margin-bottom: 10px;
}

.action-btn {
  font-size: 1.2rem;
  margin-right: 30px;
  color: #808080;
  font-weight: bold;
}

.selected {
  border-bottom: solid 2px #FF8C00;
  border-radius: 2px;
  color: v-bind(textColor);
}

.amount-input-container {
  width: 100%;
}

.amount-input-container input {

}

.amount-input-text {
  font-size: 0.8rem;
  color: #808080;
}

.amount-input-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
}

.amount-input-value {
  width: 120px;
  padding: 10px;
  background-color: v-bind(colorDarkGray);
  color: v-bind(textColor);
  border-radius: 15px;
  text-align: end;
  padding-right: 20px;
}

.amount-input-value:hover {
  background-color: v-bind(colorGray);
}

.amount-input-value:focus {
  outline: none;
  box-shadow: none;
}

.buy-sell-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.buy-sell-btn {
  width: 60%;
  border-radius: 20px;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
}

.buy-btn {
  background-color: green;
}

.sell-btn {
  background-color: red;
}

.buy-sell-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.amount-input-value:disabled {
  background-color: #eeeeee;
  color: #aaaaaa;
  cursor: not-allowed;
}

</style>