<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserPreferencesStore } from '@/stores/userPreferences'
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useCryptosStore } from '@/stores/cryptos'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const storeUserPreferences = useUserPreferencesStore()
const storeUsers = useUsersStore()
const storeCryptos = useCryptosStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const props = defineProps<{ cryptoId: string }>()

let amountToSend: number | undefined = undefined;
let assetAmountToSend: number | undefined = undefined;

const userCrypto = computed(() => storeTransactions.cryptos[0]);
const crypto = computed(() => storeCryptos.crypto)

const selectedAction = ref<'buy' | 'sell'>('buy');
const selectedOption = ref<'amount' | 'assetAmount'>('amount');
const amount = ref();

const userData = ref<User | null>(null);
const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const loadUserData = async () => {
  if (!storeAuth.isLoggedIn()) return;
  userData.value = await storeUsers.GetUserById(userId, token);
}

const loadCrypto = async () => {
  if (!storeAuth.isLoggedIn()) return;
  await storeTransactions.GetCryptos(userId, token, props.cryptoId);
};

onMounted(async () => {
  await loadUserData();
  await loadCrypto();
});

const handleBuy = async () => {
  if (selectedOption.value === 'amount') {
    amountToSend = parseFloat(amount.value);
  } else if (selectedOption.value === 'assetAmount') {
    assetAmountToSend = parseFloat(amount.value);
  }

  const success = await storeTransactions.BuyCrypto(userId, props.cryptoId, token, amountToSend, assetAmountToSend);

  if (success) {
    await loadUserData();
    await loadCrypto();
  } else {
    alert('Hubo un error al realizar la compra');
  }
  amount.value = '';
  amountToSend = undefined;
  assetAmountToSend = undefined;
};

const handleSell = async () => {
  if (selectedOption.value === 'amount') {
    amountToSend = parseFloat(amount.value);
  } else if (selectedOption.value === 'assetAmount') {
    assetAmountToSend = parseFloat(amount.value);
  }

  const success = await storeTransactions.SellCrypto(userId, props.cryptoId, token, amountToSend, assetAmountToSend);

  if (success) {
    await loadUserData();
    await loadCrypto();
  } else {
    alert('Hubo un error al realizar la venta');
  }
  amount.value = '';
  amountToSend = undefined;
  assetAmountToSend = undefined;
};

watch(() => props.cryptoId, async () => {
  await loadCrypto();
});

watch([selectedAction, selectedOption], () => {
  amount.value = '';
});

watch(selectedAction, () => {
  selectedOption.value = 'amount';
});
</script>

<template>
  <div class="main-container">
    <div class="actions-container">
      <div class="action-btn-content">
        <button
          class="action-btn"
          :class="{ selected: selectedAction === 'buy' }"
          @click="selectedAction = 'buy'"
        >
          {{ t('TransactionComponent_Buy_Btn') }}
        </button>
        <button
          v-if="userCrypto && userCrypto.totalAssetAmount > 0"
          class="action-btn"
          :class="{ selected: selectedAction === 'sell' }"
          @click="selectedAction = 'sell'"
        >
          {{ t('TransactionComponent_Sell_Btn') }}
        </button>
      </div>

      <div v-if="selectedAction" class="amount-input-container">
        <label v-if="storeAuth.isLoggedIn()" class="amount-input-text">
          {{ selectedAction === 'buy'
            ? `${storeUserPreferences.convertPrice(Number(userData?.cash), storeUserPreferences.selectedCurrency, 'after')} ${t('TransactionComponent_Available_Text')}`
            : `${userCrypto.totalAssetAmount.toFixed(6)} ${t('TransactionComponent_Available_Assets_Text')}`

          }}
        </label>

        <div class="select-option-content">
          <button 
            class="select-option-btn"
            :class="{ selectedOption: selectedOption === 'amount' }"
            @click="selectedOption = 'amount'"
          >
            {{ t('TransactionComponent_Import_Text') }}
          </button>
          <button 
            class="select-option-btn"
            :class="{ selectedOption: selectedOption === 'assetAmount' }"
            @click="selectedOption = 'assetAmount'"
          >
            {{ t('TransactionComponent_Actives_Text') }}
          </button>

        </div>

        <div class="amount-input-content">
          <span class="amount-input-title">{{ selectedOption === 'amount' ? t('TransactionComponent_Import_Text') : t('TransactionComponent_Assets_Text') }}</span>
          <input 
            v-model="amount" 
            class="amount-input-value"
            placeholder="0" 
            :disabled="!storeAuth.isLoggedIn()" />
        </div>

        <div v-if="selectedOption === 'amount'" class="asset-info-container">
          <span class="amount-input-title">{{ t('TransactionComponent_Actives_Text') }}</span>
          <span class="asset-info-value">
            {{
              crypto && amount && !isNaN(amount)
                ? storeUserPreferences.convertPriceFullDecimals((parseFloat(amount) / crypto.current_price), storeUserPreferences.selectedCurrency)
                : 0
            }} 
          </span>
        </div>

        <div v-if="selectedOption === 'assetAmount'" class="asset-info-container">
          <span class="amount-input-title">{{ t('TransactionComponent_Market_Price_Text') }}</span>
          <span class="asset-info-value">{{ storeUserPreferences.convertPrice(crypto.current_price, storeUserPreferences.selectedCurrency, 'after') }}</span>
        </div>

        <div v-if="selectedOption === 'assetAmount'" class="asset-info-container mt-7">
          <span class="amount-input-title">{{ t('TransactionComponent_Total_Text') }}</span>
          <span class="asset-info-value">
            {{
              selectedOption === 'assetAmount' && crypto && amount && !isNaN(amount)
                ? storeUserPreferences.convertPrice((parseFloat(amount) * crypto.current_price), storeUserPreferences.selectedCurrency, 'after')
                : 0
            }} 
          </span>
        </div>

        <div class="buy-sell-btn-container">
          <button 
            :class="['buy-sell-btn', selectedAction === 'buy' ? 'buy-btn' : 'sell-btn']"
            :disabled="!storeAuth.isLoggedIn() || !amount || amount == 0"
            @click="selectedAction === 'buy' ? handleBuy() : handleSell()"
          >
            {{ selectedAction === 'buy' ? t('TransactionComponent_Buy_Btn') : t('TransactionComponent_Sell_Btn') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!storeAuth.isLoggedIn()">
      <span class="positions-message">{{ t('TransactionComponent_Logout_Message') }}</span>
    </div>

    <div v-if="storeAuth.isLoggedIn() && !userCrypto">
      <span class="positions-message">{{ t('TransactionComponent_Position_Message') }}</span>
    </div>

    <div v-if="storeAuth.isLoggedIn() && userCrypto" class="positions-container">
      <div class="positions-title">{{ t('TransactionComponent_Position_Text') }}</div>
      <div class="positions-total-content">
        <span class="positions-text">{{ t('TransactionComponent_Total_Text') }}</span>
        <span class="positions-total-value">
          {{ storeUserPreferences.convertPrice(userCrypto.total, storeUserPreferences.selectedCurrency, 'after') }}
        </span>
      </div>

      <div class="positions-profit-content">
        <span class="positions-text">{{ t('TransactionComponent_Profitability_Text') }}</span>
        <span class="positions-profit-value" :style="{ color: storeUserPreferences.getPriceColor(userCrypto.balance) }">
          <v-icon class="positions-profit-icon mb-1">
            {{ storeUserPreferences.getArrowDirection(userCrypto.balance) }}
          </v-icon>
          <span class="mr-2">{{ storeUserPreferences.convertPrice(Math.abs(userCrypto.balance), storeUserPreferences.selectedCurrency, 'after') }}</span>
          <span>
            ({{ userCrypto.balancePercentage > 0 ? '+' : '-' }} {{ Math.abs(userCrypto.balancePercentage).toFixed(2) }} %)
          </span>
        </span>
      </div>

      <div class="positions-info-content">
        <div class="positions-info-assets">
          <span class="positions-text">{{ t('TransactionComponent_Actives_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.convertAssetAmount(userCrypto.totalAssetAmount) }}</span>
        </div>
        <div class="positions-info-purchase-price">
          <span class="positions-text">{{ t('TransactionComponent_Purchase_Price_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.convertPrice(userCrypto.averagePurchasePrice, storeUserPreferences.selectedCurrency, 'after') }}</span>
        </div>
        <div class="positions-info-percentage">
          <span class="positions-text">{{ t('TransactionComponent_Purchase_Percentage_Text') }}</span>
          <span class="positions-info-value">{{ userCrypto.walletPercentage.toFixed(2) }} %</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
  padding: 50px;
}

.actions-container {
  margin: 50px 0 30px 0;
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

.amount-input-text {
  font-size: 0.8rem;
  color: #808080;
}

.select-option-content {
  margin-top: 20px;
}

.select-option-btn {
  border-radius: 20px;
  padding: 3px 8px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 20px;
}

.selectedOption {
  background-color: v-bind(colorDarkGray);
}

.amount-input-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.amount-input-title {
  color: #808080;
  font-weight: bold;
  font-size: 0.95rem;
}

.amount-input-value {
  width: 120px;
  height: 40px;
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

.asset-info-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 15px 0 0;
}

.asset-info-value {
  font-size: 0.9rem;
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

.buy-btn:hover {
  background-color: #008000c0;
}

.sell-btn {
  background-color: red;
}

.sell-btn:hover {
  background-color: #ff0000b7;
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

.positions-message {
  font-size: 0.9rem;
  font-weight: bold;
  color: #808080;
}

.positions-container {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}

.positions-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.positions-text {
  font-size: 0.9rem;
  color: #808080;
  margin-bottom: 10px;
}

.positions-total-content {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.positions-total-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.positions-profit-content {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.positions-profit-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.positions-profit-icon {
  font-size: 1.4rem;
}

.positions-info-content {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.positions-info-assets {
  display: flex;
  flex-direction: column;
  max-width: 30%;
  justify-content: space-between;
}

.positions-info-purchase-price {
  display: flex;
  flex-direction: column;
  max-width: 40%;
  justify-content: space-between;
  /* white-space: nowrap; */
}

.positions-info-percentage {
  display: flex;
  flex-direction: column;
  max-width: 30%;
  justify-content: space-between;
}
</style>