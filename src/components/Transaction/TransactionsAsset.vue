<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserPreferencesStore } from '@/stores/userPreferences'
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useCryptosStore } from '@/stores/cryptos'
import { useStocksStore } from '@/stores/stocks'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const storeUserPreferences = useUserPreferencesStore()
const storeUsers = useUsersStore()
const storeCryptos = useCryptosStore()
const storeStocks = useStocksStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const props = defineProps<{ assetId: string, typeOfAsset: string }>()

const errorMessages = ref<{
  buy?: string,
  sell?: string,
}>({})

let amountToSend: number | undefined = undefined;
let assetAmountToSend: number | undefined = undefined;

const userAsset = computed(() => {
  return storeTransactions.assets.find(a => a.assetId === props.assetId);
});

const crypto = computed(() => storeCryptos.crypto)
const stock = computed(() => storeStocks.stock)

const assetPrice = computed(() => {
  if (props.typeOfAsset === 'Crypto') {
    return Number(crypto.value?.current_price);
  } else {
    return Number(stock.value?.price);
  }
});

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

const loadAsset = async () => {
  if (!storeAuth.isLoggedIn()) return;

  if (props.typeOfAsset === 'Crypto') {
    await storeTransactions.GetAssets(userId, token, 'Crypto', props.assetId);
  } else {
    await storeTransactions.GetAssets(userId, token, 'Stock', props.assetId);
  }
};

onMounted(async () => {
  await loadUserData();
  await loadAsset();
});

const handleBuy = async () => {
  if (!validateFields()) return

  if (selectedOption.value === 'amount') {
    amountToSend = parseFloat(storeUserPreferences.normalizeInputAmount(amount.value, storeUserPreferences.selectedCurrency));
  } else if (selectedOption.value === 'assetAmount') {
    assetAmountToSend = parseFloat(amount.value);
  }

  if (props.typeOfAsset === 'Crypto') {
    await storeTransactions.BuyCrypto(userId, props.assetId, token, amountToSend, assetAmountToSend);
  } else {
    await storeTransactions.BuyStock(userId, props.assetId, token, amountToSend, assetAmountToSend);
  }

  await loadUserData();
  await loadAsset();
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
    amountToSend = parseFloat(storeUserPreferences.normalizeInputAmount(amount.value, storeUserPreferences.selectedCurrency));
  } else if (selectedOption.value === 'assetAmount') {
    assetAmountToSend = parseFloat(amount.value);
  }

  if (props.typeOfAsset === 'Crypto') {
    await storeTransactions.SellCrypto(userId, props.assetId, token, amountToSend, assetAmountToSend);
  } else {
    await storeTransactions.SellStock(userId, props.assetId, token, amountToSend, assetAmountToSend);
  }

  await loadUserData();
  await loadAsset();
  successMessage.value = t('TransactionsAsset_Sell_Success');
  setTimeout(() => {
    successMessage.value = null;
  }, 5000);

  amount.value = '';
  amountToSend = undefined;
  assetAmountToSend = undefined;
};

watch(() => props.assetId, async () => {
  await loadAsset();
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
  const total = userAsset.value?.total ? userAsset.value.total : 0;
  const totalAssetAmount = userAsset.value?.totalAssetAmount ? userAsset.value.totalAssetAmount : 0;

  const fieldName = isBuy ? 'buy' : 'sell';

  if ((amount.value < 1 && selectedOption.value === 'amount') || (amount.value === '0' && selectedOption.value === 'assetAmount')) {
    errorMessages.value[fieldName] = t(
      isBuy ? 'TransactionsAsset_Buy_Low_Error' : 'TransactionsAsset_Sell_Low_Error'
    );
  } else if ((isBuy && amount.value > cash && selectedOption.value === 'amount') || (isBuy && amount.value * assetPrice.value > cash && selectedOption.value === 'assetAmount')) {
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
          v-if="userAsset && userAsset.totalAssetAmount > 0"
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
            : storeUserPreferences.showPrices ? `${userAsset?.totalAssetAmount.toFixed(6)} ${t('TransactionsAsset_Available_Assets_Text')}` : '******'
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
            @input="() => { hasInteracted = true; validateFields(); }" 
          />
          <span v-if="selectedOption === 'amount'" class="amount-input-currency">
            {{ storeUserPreferences.getCurrencySymbol(storeUserPreferences.selectedCurrency) }}
          </span>
        </div>

        <div v-if="selectedOption === 'amount'" class="asset-info-container">
          <span class="amount-input-title">{{ t('TransactionsAsset_Actives_Text') }}</span>
          <span class="asset-info-value">
            {{
              (crypto || stock) && amount && !isNaN(amount)
                ? storeUserPreferences.convertPriceFullDecimals((parseFloat(amount) / assetPrice), storeUserPreferences.selectedCurrency)
                : 0
            }} 
          </span>
        </div>

        <div v-if="selectedOption === 'assetAmount'" class="asset-info-container">
          <span class="amount-input-title">{{ t('TransactionsAsset_Market_Price_Text') }}</span>
          <span class="asset-info-value">{{ storeUserPreferences.convertPrice(assetPrice, storeUserPreferences.selectedCurrency, 'after') }}</span>
        </div>

        <div v-if="selectedOption === 'assetAmount'" class="asset-info-container mt-7">
          <span class="amount-input-title">{{ t('TransactionsAsset_Total_Text') }}</span>
          <span class="asset-info-value">
            {{
              selectedOption === 'assetAmount' && (crypto || stock) && amount && !isNaN(amount)
                ? storeUserPreferences.convertPrice((parseFloat(amount) * assetPrice), storeUserPreferences.selectedCurrency, 'after')
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
              (selectedAction === 'buy' && selectedOption === 'assetAmount' && parseFloat(amount) * assetPrice > Number(userData?.cash)) ||
              (selectedAction === 'sell' && selectedOption === 'amount' && parseFloat(amount) > (userAsset?.total ?? 0)) ||
              (selectedAction === 'sell' && selectedOption === 'assetAmount' && parseFloat(amount) > (userAsset?.totalAssetAmount ?? 0))"
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
  </div>
</template>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
  padding: 50px 50px 0 50px;
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
  color: var(--gray-color);
  font-weight: bold;
}

.selected {
  border-bottom: solid 2px var(--primary-color);
  border-radius: 2px;
  color: v-bind(textColor);
}

.amount-input-container {
  width: 100%;
}

.amount-input-text {
  font-size: 0.8rem;
  color: var(--gray-color);
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
  color: var(--gray-color);
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
  color: var(--white-color);
}

.buy-btn {
  background-color: var(--green-color);
}

.buy-btn:hover {
  background-color: var(--green-color-hover);
}

.sell-btn {
  background-color: var(--red-color);
}

.sell-btn:hover {
  background-color: var(--red-color-hover);
}

.buy-sell-btn:disabled {
  background-color: var(--gray-color);
  cursor: not-allowed;
  opacity: 0.6;
}

.amount-input-value:disabled {
  cursor: not-allowed;
}

.buy-sell-error {
  color: var(--red-color);
  font-size: 0.85rem;
  font-weight: bold;
  position: absolute;
  top: 480px;
  right: 100px;
}

.buy-sell-success {
  color: var(--green-color);
  font-size: 0.85rem;
  font-weight: bold;
  position: absolute;
  top: 480px;
  right: 110px;
}

.asset-amount-message {
  margin-top: 50px;
}
</style>