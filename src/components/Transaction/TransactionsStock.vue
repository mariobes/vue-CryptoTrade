<!-- <script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserPreferencesStore } from '@/stores/userPreferences'
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useStocksStore } from '@/stores/stocks'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const storeUserPreferences = useUserPreferencesStore()
const storeUsers = useUsersStore()
const storeStocks = useStocksStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const props = defineProps<{ stockId: string }>()

const errorMessages = ref<{
  buy?: string,
  sell?: string,
}>({})

let amountToSend: number | undefined = undefined;
let assetAmountToSend: number | undefined = undefined;

const userStock = computed(() => {
  return storeTransactions.stocks.find(c => c.assetId === props.stockId);
});

const stock = computed(() => storeStocks.stock)

const selectedAction = ref<'buy' | 'sell'>('buy');
const selectedOption = ref<'amount' | 'assetAmount'>('amount');
const amount = ref();
const hasInteracted = ref(false)
const successMessage = ref<string | null>(null);

const userData = ref<User | null>(null);
const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const userCash = computed(() => {
  return Number(userData.value?.cash || 0);
});

const loadUserData = async () => {
  if (!storeAuth.isLoggedIn()) return;
  userData.value = await storeUsers.GetUserById(userId, token);
}

const loadStock = async () => {
  if (!storeAuth.isLoggedIn()) return;
  await storeTransactions.GetStocks(userId, token, props.stockId);
};

onMounted(async () => {
  await loadUserData();
  await loadStock();
});

const handleBuy = async () => {
  if (!validateFields()) return

  if (selectedOption.value === 'amount') {
    amountToSend = parseFloat(amount.value);
  } else if (selectedOption.value === 'assetAmount') {
    assetAmountToSend = parseFloat(amount.value);
  }

  await storeTransactions.BuyCrypto(userId, props.stockId, token, amountToSend, assetAmountToSend);

  await loadUserData();
  await loadStock();
  successMessage.value = t('TransactionsAsset_Buy_Success');
  setTimeout(() => {
    successMessage.value = null;
  }, 5000);

  amount.value = '';
  amountToSend = undefined;
  assetAmountToSend = undefined;
};

const handleSell = async () => {
  if (!validateFields()) return

  if (selectedOption.value === 'amount') {
    amountToSend = parseFloat(amount.value);
  } else if (selectedOption.value === 'assetAmount') {
    assetAmountToSend = parseFloat(amount.value);
  }

  await storeTransactions.SellCrypto(userId, props.stockId, token, amountToSend, assetAmountToSend);

  await loadUserData();
  await loadStock();
  successMessage.value = t('TransactionsAsset_Sell_Success');
  setTimeout(() => {
    successMessage.value = null;
  }, 5000);

  amount.value = '';
  amountToSend = undefined;
  assetAmountToSend = undefined;
};

watch(() => props.stockId, async () => {
  await loadStock();
});

watch([selectedAction, selectedOption], () => {
  amount.value = '';
  errorMessages.value = {}
  hasInteracted.value = false
});

watch(selectedAction, () => {
  selectedOption.value = 'amount';
});

const validateFields = () => {
  errorMessages.value = {}

  const isBuy = selectedAction.value === 'buy';
  const isSell = selectedAction.value === 'sell';
  const cash = Number(userData.value?.cash);
  const stockPrice = Number(stock.value?.price);
  const total = userStock.value.total;
  const totalAssetAmount = userStock.value.totalAssetAmount;

  const fieldName = isBuy ? 'buy' : 'sell';

  if ((amount.value < 1 && selectedOption.value === 'amount') || (amount.value === '0' && selectedOption.value === 'assetAmount')) {
    errorMessages.value[fieldName] = t(
      isBuy ? 'TransactionsAsset_Buy_Low_Error' : 'TransactionsAsset_Sell_Low_Error'
    );
  } else if ((isBuy && amount.value > cash && selectedOption.value === 'amount') || (isBuy && amount.value * stockPrice > cash && selectedOption.value === 'assetAmount')) {
    errorMessages.value[fieldName] = t('TransactionsAsset_Buy_High_Error');
  } else if ((isSell && amount.value > total && selectedOption.value === 'amount') || (isSell && amount.value > totalAssetAmount) && selectedOption.value === 'assetAmount') {
    errorMessages.value[fieldName] = t('TransactionsAsset_Sell_High_Error');
  }

  return Object.keys(errorMessages.value).length === 0
}

watch(amount, () => {
  if (hasInteracted.value && !successMessage.value) {
    validateFields()
  }
})
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
          {{ t('TransactionsAsset_Buy_Btn') }}
        </button>
        <button
          v-if="userStock && userStock.totalAssetAmount > 0"
          class="action-btn"
          :class="{ selected: selectedAction === 'sell' }"
          @click="selectedAction = 'sell'"
        >
          {{ t('TransactionsAsset_Sell_Btn') }}
        </button>
      </div>

      <div v-if="selectedAction" class="amount-input-container">
        <label v-if="storeAuth.isLoggedIn()" class="amount-input-text">
          {{ selectedAction === 'buy'
            ? `${storeUserPreferences.convertPrice(userCash, storeUserPreferences.selectedCurrency, 'after', true)} ${t('TransactionsAsset_Available_Text')}`
            : storeUserPreferences.showPrices ? `${userStock.totalAssetAmount.toFixed(6)} ${t('TransactionsAsset_Available_Assets_Text')}` : '******'
          }}
        </label>

        <div class="select-option-content">
          <button 
            class="select-option-btn"
            :class="{ selectedOption: selectedOption === 'amount' }"
            @click="selectedOption = 'amount'"
          >
            {{ t('TransactionsAsset_Import_Text') }}
          </button>
          <button 
            class="select-option-btn"
            :class="{ selectedOption: selectedOption === 'assetAmount' }"
            @click="selectedOption = 'assetAmount'"
          >
            {{ t('TransactionsAsset_Actives_Text') }}
          </button>

        </div>

        <div class="amount-input-content">
          <span class="amount-input-title">{{ selectedOption === 'amount' ? t('TransactionsAsset_Import_Text') : t('TransactionsAsset_Assets_Text') }}</span>
          <input 
            v-model="amount" 
            class="amount-input-value"
            placeholder="0" 
            :disabled="!storeAuth.isLoggedIn()"
            @input="() => { hasInteracted = true; validateFields(); }" />

            <span class="amount-input-currency">
              {{ storeUserPreferences.getCurrencySymbol(storeUserPreferences.selectedCurrency) }}
            </span>
        </div>

        <div v-if="selectedOption === 'amount'" class="asset-info-container">
          <span class="amount-input-title">{{ t('TransactionsAsset_Actives_Text') }}</span>
          <span class="asset-info-value">
            {{
              stock && amount && !isNaN(amount)
                ? storeUserPreferences.convertPriceFullDecimals((parseFloat(amount) / stock.price), storeUserPreferences.selectedCurrency)
                : 0
            }} 
          </span>
        </div>

        <div v-if="selectedOption === 'assetAmount'" class="asset-info-container">
          <span class="amount-input-title">{{ t('TransactionsAsset_Market_Price_Text') }}</span>
          <span class="asset-info-value">{{ storeUserPreferences.convertPrice(stock.price, storeUserPreferences.selectedCurrency, 'after') }}</span>
        </div>

        <div v-if="selectedOption === 'assetAmount'" class="asset-info-container mt-7">
          <span class="amount-input-title">{{ t('TransactionsAsset_Total_Text') }}</span>
          <span class="asset-info-value">
            {{
              selectedOption === 'assetAmount' && stock && amount && !isNaN(amount)
                ? storeUserPreferences.convertPrice((parseFloat(amount) * stock.price), storeUserPreferences.selectedCurrency, 'after')
                : 0
            }} 
          </span>
        </div>

        <div class="buy-sell-btn-container">
          <button 
            :class="['buy-sell-btn', selectedAction === 'buy' ? 'buy-btn' : 'sell-btn']"
            @click="selectedAction === 'buy' ? handleBuy() : handleSell()"
            :disabled="!storeAuth.isLoggedIn() || !amount ||
              (selectedOption === 'amount' && parseFloat(amount) < 1) ||
              (selectedOption === 'assetAmount' && parseFloat(amount) === 0) ||
              (selectedAction === 'buy' && selectedOption === 'amount' && parseFloat(amount) > Number(userData?.cash)) ||
              (selectedAction === 'buy' && selectedOption === 'assetAmount' && parseFloat(amount) * Number(stock?.price) > Number(userData?.cash)) ||
              (selectedAction === 'sell' && selectedOption === 'amount' && parseFloat(amount) > userStock.total) ||
              (selectedAction === 'sell' && selectedOption === 'assetAmount' && parseFloat(amount) > userStock.totalAssetAmount)"
          >
            {{ selectedAction === 'buy' ? t('TransactionsAsset_Buy_Btn') : t('TransactionsAsset_Sell_Btn') }}
          </button>
        </div>

        <span v-if="errorMessages.buy || errorMessages.sell" class="buy-sell-error" :class="selectedOption === 'assetAmount' ? 'asset-amount-message' : ''">
          {{ selectedAction === 'buy' ? errorMessages.buy : errorMessages.sell }}
        </span>
        <span v-if="successMessage" class="buy-sell-success" :class="selectedOption === 'assetAmount' ? 'asset-amount-message' : ''">
          {{ successMessage }}
        </span>
      </div>
    </div>

    <div v-if="!storeAuth.isLoggedIn()">
      <span class="positions-message">{{ t('TransactionsAsset_Logout_Message') }}</span>
    </div>

    <div v-if="storeAuth.isLoggedIn() && !userStock">
      <span class="positions-message">{{ t('TransactionsAsset_Position_Message') }}</span>
    </div>

    <div v-if="storeAuth.isLoggedIn() && userStock" class="positions-container">
      <div class="positions-title">
        <span>{{ t('TransactionsAsset_Position_Text') }}</span>
        <span @click="storeUserPreferences.toggleShowPrices()" class="eye-icon">
          <span v-if="storeUserPreferences.showPrices" class="mdi mdi-eye-outline"></span>
          <span v-else class="mdi mdi-eye-off-outline"></span>
        </span>
      </div>
      <div class="positions-total-content">
        <span class="positions-text">{{ t('TransactionsAsset_Total_Text') }}</span>
        <span class="positions-total-value">
          {{ storeUserPreferences.convertPrice(userStock.total, storeUserPreferences.selectedCurrency, 'after', true) }}
        </span>
      </div>

      <div class="positions-profit-content">
        <span class="positions-text">{{ t('TransactionsAsset_Profitability_Text') }}</span>
        <span class="positions-profit-value" :style="{ color: storeUserPreferences.getPriceColor(userStock.balance) }">
          <v-icon class="positions-profit-icon mb-1">
            {{ storeUserPreferences.getArrowDirection(userStock.balance) }}
          </v-icon>
          <span class="mr-2">{{ storeUserPreferences.convertPrice(Math.abs(userStock.balance), storeUserPreferences.selectedCurrency, 'after', true) }}</span>
          <span>
            ({{ userStock.balancePercentage > 0 ? '+' : '-' }} {{ storeUserPreferences.maskedPrice(Math.abs(userStock.balancePercentage)) }} %)
          </span>
        </span>
      </div>

      <div class="positions-info-content">
        <div class="positions-info-assets">
          <span class="positions-text">{{ t('TransactionsAsset_Actives_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.convertAssetAmount(userStock.totalAssetAmount, true) }}</span>
        </div>
        <div class="positions-info-purchase-price">
          <span class="positions-text">{{ t('TransactionsAsset_Purchase_Price_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.convertPrice(userStock.averagePurchasePrice, storeUserPreferences.selectedCurrency, 'after', true) }}</span>
        </div>
        <div class="positions-info-percentage">
          <span class="positions-text">{{ t('TransactionsAsset_Purchase_Percentage_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.maskedPrice(userStock.walletPercentage) }} %</span>
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
  padding-right: 25px;
}

.amount-input-value:hover {
  background-color: v-bind(colorGray);
}

.amount-input-value:focus {
  outline: none;
  box-shadow: none;
}

.amount-input-currency {
  position: absolute;
  transform: translateX(257px);
  font-size: 0.9rem;
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

.eye-icon {
  cursor: pointer;
  margin-left: 15px;
  color: #808080;
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

.buy-sell-error {
  color: #ff0000cc;
  font-size: 0.85rem;
  font-weight: bold;
  position: absolute;
  top: 480px;
  right: 100px;
}

.buy-sell-success {
  color: green;
  font-size: 0.85rem;
  font-weight: bold;
  position: absolute;
  top: 480px;
  right: 110px;
}

.asset-amount-message {
  margin-top: 50px;
}
</style> -->