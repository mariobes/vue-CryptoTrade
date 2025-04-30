<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserPreferencesStore } from '@/stores/userPreferences';
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const colorGray = computed(() => storeUserPreferences.getTheme().colorGray)

const storeUsers = useUsersStore()
const storeUserPreferences = useUserPreferencesStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const props = defineProps<{
  visible: boolean;
  action: 'deposit' | 'withdrawal' | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit'): void;
  (e: 'update-cash', newCashValue: number): void;
}>();


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
    closePanel();
    emit('update-cash', userData.value?.cash);
  } else {
    alert('Hubo un error al realizar el deposito');
  }
};

const handleWithdrawal = async () => {
  const success = await storeTransactions.MakeWithdrawal(userId, amount.value, token);

  if (success) {
    await loadUserData();
    amount.value = '';
    closePanel();
    emit('update-cash', userData.value?.cash);
  } else {
    alert('Hubo un error al realizar el retiro');
  }
};

const paymentMethodLabels = {
  0: 'Transferencia bancaria',
  1: 'Tarjeta de crédito',
  2: 'Google Pay'
}

const closePanel = () => {
  selectedPaymentMethod.value = null;
  amount.value = '';
  emit('close');
};
</script>

<template>
<transition name="slide-panel">
  <div v-if="props.visible" class="panel-overlay" @click.self="closePanel">
    <div class="deposit-withdrawal-panel" @click.stop>
      <v-btn 
        icon 
        @click="closePanel" 
        class="popup-close-btn" 
        :ripple="false"
        density="compact"
      >
        <v-icon size="25">mdi-close</v-icon>
      </v-btn>

      <div class="panel-content">
        <div class="panel-title">
          <span v-if="props.action === 'withdrawal'">
            {{ t('UserInfo_Panel_Withdrawal_Title') }}
          </span>
          <span v-else-if="props.action === 'deposit' && selectedPaymentMethod === null">
            {{ t('UserInfo_Panel_Payment_Title') }}
          </span>
          <span v-else-if="props.action === 'deposit' && selectedPaymentMethod !== null">
            {{ t('UserInfo_Panel_Deposit_Title') }}
          </span>
        </div>

        <v-btn
          v-if="props.action === 'deposit' && selectedPaymentMethod !== null"
          icon
          @click="selectedPaymentMethod = null"
          class="popup-close-btn"
          style="top: 265px; left: 40px;" 
          :style="{ color: textColor }"
          :ripple="false"
          density="compact"
        >
          <v-icon size="25">mdi-arrow-left</v-icon>
        </v-btn>

        <div v-if="props.action === 'deposit' && selectedPaymentMethod === null" class="panel-payment-options">
          <div>
            <button @click="selectedPaymentMethod = 0" class="panel-payment-btn">
              <span class="mdi mdi-bank-outline panel-payment-icon"></span>
              <div class="payment-text-content">
                <span class="panel-payment-title">{{ t('UserInfo_Panel_Transfer_Bank_Title') }}</span>
                <span class="panel-payment-text">{{ t('UserInfo_Panel_Transfer_Bank_Text') }}</span>
              </div>
            </button>
          </div>
          <div>
            <button @click="selectedPaymentMethod = 1" class="panel-payment-btn">
              <span class="mdi mdi-credit-card-outline panel-payment-icon"></span>
              <div class="payment-text-content">
                <span class="panel-payment-title">{{ t('UserInfo_Panel_Credit_Card_Title') }}</span>
                <span class="panel-payment-text">{{ t('UserInfo_Panel_Credit_Card_Text') }}</span>
              </div>
            </button>
          </div>
          <div>
            <button @click="selectedPaymentMethod = 2" class="panel-payment-btn">
              <span class="mdi mdi-google panel-payment-icon"></span>
              <div class="payment-text-content">
                <span class="panel-payment-title">{{ t('UserInfo_Panel_Google_pay_Title') }}</span>
                <span class="panel-payment-text">{{ t('UserInfo_Panel_Google_pay_Text') }}</span>
              </div>
            </button>
          </div>
        </div>

        <div v-if="props.visible && props.action === 'withdrawal'" class="panel-payment">
          <span class="mdi mdi-bank-outline panel-payment-icon"></span>
          <span class="panel-payment-title">{{ paymentMethodLabels[0] }}</span>
        </div>

        <div v-if="props.action === 'deposit' && selectedPaymentMethod !== null" class="panel-payment">
          <span v-if="selectedPaymentMethod === 0" class="mdi mdi-bank-outline panel-payment-icon"></span>
          <span v-else-if="selectedPaymentMethod === 1" class="mdi mdi-credit-card-outline panel-payment-icon"></span>
          <span v-else-if="selectedPaymentMethod === 2" class="mdi mdi-google panel-payment-icon"></span>
          <span class="panel-payment-title">{{ paymentMethodLabels[selectedPaymentMethod] }}</span>
        </div>          
        
        <div v-if="(props.action === 'withdrawal') || (props.action === 'deposit' && selectedPaymentMethod !== null)" 
          class="panel-input"
        >
          <input
            v-model="amount"
            class="panel-input-value"
            :style="{ background: colorGray }"
            placeholder="0" />
        </div>

        <div v-if="props.visible && props.action === 'withdrawal'" class="cash-available-text">
          <span>
            {{ storeUserPreferences.convertPrice(userData?.cash, storeUserPreferences.selectedCurrency, 'after') }}
            {{ t('UserInfo_Panel_Avaiable') }}
          </span>
        </div>

        <button 
          v-if="(props.action === 'withdrawal') || (props.action === 'deposit' && selectedPaymentMethod !== null)"
          class="panel-input-btn"
          @click="props.action === 'withdrawal' ? handleWithdrawal() : handleDeposit()" 
          :disabled="!amount || amount < 1"
        >
        {{ props.action === 'deposit' ? t('UserInfo_Deposit_Btn') : t('UserInfo_Withdrawal_Btn') }}
        </button>
      </div>
    </div>
  </div>
</transition>
</template>

<style scoped>
.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
}

.deposit-withdrawal-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 450px;
  height: 100%;
  background-color: v-bind(backgroundSettings);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s ease;
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}
.slide-panel-enter-to,
.slide-panel-leave-from {
  transform: translateX(0);
}

.popup-close-btn {
  position: absolute;
  top: 40px;
  left: 40px;
  background-color: transparent;
  box-shadow: none;
  color: v-bind(textColor);
}

.popup-close-btn:hover {
  box-shadow: none !important;
  background-color: transparent !important;
}

::v-deep(.popup-close-btn .v-btn__overlay) {
  background-color: transparent !important;
}

.panel-content {
  width: 70%;
  height: 450px;
  display: flex;
  flex-direction: column;
  color: v-bind(textColor);
  font-weight: bold;
}

.panel-title {
  font-size: 2rem;
  margin: 0 0 20px 30px;
}

.panel-payment-options {
  display: flex;
  flex-direction: column;
}

.panel-payment-btn {
  font-size: 1.2rem;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.panel-payment-btn:hover {
  background-color: #ffffff22;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.payment-text-content {
  display: flex;
  flex-direction: column;
}

.panel-payment-icon {
  font-size: 1.6rem;
  margin-right: 30px;
}

.panel-payment-title {
  font-size: 1.2rem;
  text-align: start;
}

.panel-payment-text {
  font-size: 0.8rem;
  color: #808080;
  text-align: start;
}

.panel-payment {
  margin: 0 0 100px 30px;
  display: flex;
  align-items: center;
}

.panel-input {
  margin-left: 30px;
}

.panel-input-value {
  font-size: 3rem;
  max-width: 90%;
  background-color: v-bind(colorGray);
  border-radius: 10px;
  color: v-bind(textColor);
  padding: 0 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
}

.panel-input-value:hover {
  background-color: #ffffff49 !important;
}

.panel-input-value:focus {
  outline: none;
  border: none;
}

.cash-available-text {
  font-size: 0.9rem;
  color: #808080;
  margin: 10px 0 0 30px;
}

.panel-input-btn {
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  color: #000000;
  max-width: 60%;
  margin: 30px 0 0 30px;
  padding: 8px;
}

.panel-input-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.panel-input-btn:disabled {
  background-color: #eeeeee;
  color: #aaaaaa;
  cursor: not-allowed;
}

.panel-input-btn:hover {
  background-color: #ffffffc2;
}
</style>