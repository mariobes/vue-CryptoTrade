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

const successMessage = ref<string | null>(null);

const userData = ref<User | null>(null);
const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const loadUserData = async () => {
  if (!storeAuth.isLoggedIn()) return;
  userData.value = await storeUsers.GetUserById(userId, token);
}

onMounted(async () => {
  await storeTransactions.GetAssets(userId, token);
  await loadUserData();
});

const handleDeposit = async () => {};

const handleWithdrawal = async () => {};

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

const handleSuccessMessage = (newSuccessMessage: string) => {
  successMessage.value = newSuccessMessage;
  setTimeout(() => {
    successMessage.value = null;
  }, 5000);
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

onMounted(async () => {
  window.scrollTo({ top: 0 });
})
</script>

<template>
  <div class="main-container">
    <div class="info-wallet-content">
      <span class="info-wallet-text">{{ t('UserInfo_Wallet_Title') }}</span>

      <span class="info-wallet-value">
        <span>
          {{ storeUserPreferences.showPrices ? storeUserPreferences.convertPrice((walletInfo.total), storeUserPreferences.selectedCurrency, 'before') : '**********' }}
        </span>
        <span @click="storeUserPreferences.toggleShowPrices()" class="eye-icon">
          <span v-if="storeUserPreferences.showPrices" class="mdi mdi-eye-outline"></span>
          <span v-else class="mdi mdi-eye-off-outline"></span>
        </span>
      </span>

      <span class="info-wallet-change" :style="{ color: storeUserPreferences.getPriceColor(walletInfo.percentage) }">
        {{ walletInfo.balance >= 0 ? '+' : '' }}
        {{ storeUserPreferences.convertPrice(walletInfo.balance, storeUserPreferences.selectedCurrency, 'before', true) }}
        <v-icon class="info-wallet-icon mb-1">
          {{ storeUserPreferences.getArrowDirection(walletInfo.percentage) }}
        </v-icon>
        {{ storeUserPreferences.maskedPrice(Math.abs(walletInfo.percentage)) }}% (24h)
      </span>
    </div>

    <div class="info-cash-content">
      <div class="info-cash-title">
        <span class="info-cash-text">{{ t('UserInfo_Cash_Title') }}</span>
        <span class="info-cash-value">{{ userData?.cash != undefined ? storeUserPreferences.convertPrice(userData?.cash, storeUserPreferences.selectedCurrency, 'after', true) : 0 }}</span>
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
          :class="storeUserPreferences.selectedTheme === 'light' ? 'withdrawal-hover-light' : 'withdrawal-hover-dark'"
          @click="openWithdrawalPanel"
        >
        {{ t('UserInfo_Withdrawal_Btn') }}
        </button>
      </div>

      <span v-if="successMessage" class="buy-sell-success">{{ successMessage }}</span>
    </div>
  </div>

  <DepositWithDrawalPanel
    :visible="showDepositPanel || showWithdrawalPanel"
    :action="activeAction"
    @close="closePanel"
    @submit="activeAction === 'deposit' ? handleDeposit() : handleWithdrawal()"
    @update-cash="updateCash"
    @success-message="handleSuccessMessage"
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
  color: var(--gray-color);
  font-size: 1.4em;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}

.info-wallet-value {
  font-size: 3rem;
  color: v-bind(textColor);
  font-weight: bold;
  margin-bottom: 5px;
}

.eye-icon {
  cursor: pointer;
  font-size: 1.8rem;
  margin-left: 10px;
  color: var(--gray-color);
  position: relative;
  top: -5px;
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
  color: var(--gray-color);
  font-size: 1.4rem;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
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
  color: var(--black-color);
  background-color: var(--white-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.deposit-hover-light:hover {
	background-color: var(--gray-color) !important;
}

.deposit-hover-dark:hover {
  background-color: var(--dark-gray-color) !important;
}

.withdrawal-hover-light:hover {
	background-color: var(--dark-gray-color) !important;
}

.withdrawal-hover-dark:hover {
  background-color: var(--white-color-hover) !important;
}

.buy-sell-success {
  color: var(--green-color);
  font-size: 0.95rem;
  font-weight: bold;
  position: absolute;
  top: 290px;
  right: 520px;
}

/* Responsive */
@media (max-width: 1250px) {
  .info-wallet-content {
    width: 100%;
  }

  .info-cash-content {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .main-container {
    margin-left: 10px;
  }

  .info-wallet-content {
    margin-right: 30px;
  }

  .eye-icon {
    display: none;
  }

  .info-cash-title {
    justify-content: end;
  }

  .info-cash-text {
    display: none;
  }
}
</style>