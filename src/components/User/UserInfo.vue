<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import DepositWithDrawalPanel from '@/components/User/DepositWithDrawalPanel.vue';
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorDarkGray = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const storeUsers = useUsersStore()
const storeUserPreferences = useUserPreferencesStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const activeAction = ref<'deposit' | 'withdrawal' | null>(null)
const showDepositPanel = ref(false)
const showWithdrawalPanel = ref(false)

const amount = ref();
const selectedPaymentMethod = ref<0 | 1 | 2 | null>(null);

const userData = ref<User | null>(null);
const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const loadUserData = async () => {
  if (!storeAuth.isLoggedIn()) return;
  userData.value = await storeUsers.GetUserById(userId, token);
}

onMounted(async () => {
  await loadUserData();
});

const handleDeposit = async () => {
  const success = await storeTransactions.MakeDeposit(userId, amount.value, selectedPaymentMethod.value!, token);

  if (success) {
    await loadUserData();
    amount.value = '';
    showDepositPanel.value = false;
  } else {
    alert('Hubo un error al realizar el deposito');
  }
};

const handleWithdrawal = async () => {
  const success = await storeTransactions.MakeWithdrawal(userId, amount.value, token);

  if (success) {
    await loadUserData();
    amount.value = '';
    showWithdrawalPanel.value = false;
  } else {
    alert('Hubo un error al realizar el retiro');
  }
};

const openDepositPanel = () => {
  activeAction.value = 'deposit'
  selectedPaymentMethod.value = null
  showDepositPanel.value = true
  amount.value = '';
}

const openWithdrawalPanel = () => {
  activeAction.value = 'withdrawal'
  showWithdrawalPanel.value = true
  amount.value = '';
}

const closePanel = () => {
  showDepositPanel.value = false;
  showWithdrawalPanel.value = false;
  activeAction.value = null;
};

const updateCash = (newCashValue: number) => {
  if (userData.value) {
    userData.value.cash = newCashValue;
  }
};

const walletInfo = computed(() => {
  const wallet = userData.value?.wallet || 0;
  const profit = userData.value?.profit || 0;
  const lastBalance = userData.value?.lastBalance || 0;

  const total = wallet + profit;
  const balance = total - lastBalance;
  const percentage = total === 0 ? 0 : (balance / total) * 100;

  return {
    total,
    balance,
    percentage,
  };
});
</script>

<template>
<div class="main-container">
	<div class="info-wallet-content">
    <span class="info-wallet-text">{{ t('UserInfo_Wallet_Title') }}</span>
    <span class="info-wallet-value">{{ storeUserPreferences.convertPrice((walletInfo.total), storeUserPreferences.selectedCurrency, 'before') }}</span>
    <span class="info-wallet-change" :style="{ color: storeUserPreferences.getPriceColor(walletInfo.percentage) }">
      {{ walletInfo.balance >= 0 ? '+' : '' }}
      {{ storeUserPreferences.convertPrice(walletInfo.balance, storeUserPreferences.selectedCurrency, 'before') }}
      <v-icon class="info-wallet-icon mb-1">
        {{ storeUserPreferences.getArrowDirection(walletInfo.percentage) }}
      </v-icon>
      {{ Math.abs(walletInfo.percentage).toFixed(2) }}% (24h)
    </span>
  </div>
	<div class="info-cash-content">
    <div class="info-cash-title">
      <span class="info-cash-text">{{ t('UserInfo_Cash_Title') }}</span>
      <span class="info-cash-value">{{ storeUserPreferences.convertPrice(userData?.cash, storeUserPreferences.selectedCurrency, 'after') }}</span>
    </div>
    <div class="info-cash-options">
      <button 
        class="info-cash-btn deposit-btn" 
        :class="storeUserPreferences.selectedTheme === 'light' ? 'deposit-hover-light' : 'deposit-hover-dark'"
        @click="openDepositPanel"
      >
      {{ t('UserInfo_Deposit_Btn') }}
      </button>
      <button 
        class="info-cash-btn withdrawal-btn"
        @click="openWithdrawalPanel"
      >
      {{ t('UserInfo_Withdrawal_Btn') }}
      </button>
    </div>
  </div>
</div>

<DepositWithDrawalPanel
  :visible="showDepositPanel || showWithdrawalPanel"
  :action="activeAction"
  @close="closePanel"
  @submit="activeAction === 'deposit' ? handleDeposit() : handleWithdrawal()"
  @update-cash="updateCash"
/>
</template>

<style scoped>
.main-container {
  max-width: 70vw;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.info-wallet-content {
  display: flex;
  flex-direction: column;
  width: 30%;
}

.info-wallet-text {
  color: #808080;
  font-size: 1.4em;
  font-weight: bold;
}

.info-wallet-value {
  font-size: 3rem;
  color: v-bind(textColor);
  font-weight: bold;
  margin-bottom: 5px;
}

.info-wallet-change {
  font-size: 1.2rem;
  font-weight: bold;
}

.info-wallet-icon {
  font-size: 1.4rem;
}

.info-cash-content {
  display: flex;
  flex-direction: column;
  width: 30%;
}

.info-cash-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 25px;
}

.info-cash-text {
  color: #808080;
  font-size: 1.4rem;
  font-weight: bold;
}

.info-cash-value {
  font-size: 1.2rem;
  color: v-bind(textColor);
  font-weight: bold;
}

.info-cash-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: v-bind(textColor);
  margin:  0 10px;
}

.info-cash-btn {
  width: 100%;
  font-weight: bold;
  border-radius: 10px;
  padding: 10px 0;
}

.deposit-btn {
  background-color: v-bind(colorDarkGray);
  margin-bottom: 15px;
}

.withdrawal-btn {
  color: #000000;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.withdrawal-btn:hover {
  background-color: #ced1d3 !important;
}

.deposit-hover-light:hover {
	background-color: #8d8989 !important;
}

.deposit-hover-dark:hover {
  background-color: #ffffff22 !important;
}
</style>