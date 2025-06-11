<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserPreferencesStore } from '@/stores/userPreferences';
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const backgroundTable = computed(() => storeUserPreferences.getTheme().table)
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
  (e: 'success-message', newSuccessMessage: string): void;
}>();

const errorMessages = ref<{
  deposit?: string,
  withdrawal?: string,
}>({})

const amount = ref();
let amountToSend: number | undefined = undefined;
const selectedPaymentMethod = ref<0 | 1 | 2 | null>(null);
const hasInteracted = ref(false);
const successMessage = ref<string | null>(null);

const bankAccount = ref('');
const creditCard = ref({
  number: '',
  expiry: '',
  name: '',
  cvc: ''
});
const googlePayEmail = ref('');

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
  if (!validateFields()) return

  amountToSend = parseFloat(storeUserPreferences.normalizeInputAmount(amount.value, storeUserPreferences.selectedCurrency));
  await storeTransactions.MakeDeposit(userId, amountToSend, selectedPaymentMethod.value!, token);

  await loadUserData();
  amount.value = '';
  closePanel();
  emit('update-cash', Number(userData.value?.cash));
  successMessage.value = t('UserInfo_Deposit_Success');
  emit('success-message', successMessage.value);
};

const handleWithdrawal = async () => {
  if (!validateFields()) return

  amountToSend = parseFloat(storeUserPreferences.normalizeInputAmount(amount.value, storeUserPreferences.selectedCurrency));
  await storeTransactions.MakeWithdrawal(userId, amountToSend, token);
  await loadUserData();
  amount.value = '';
  closePanel();
  emit('update-cash', Number(userData.value?.cash));
  successMessage.value = t('UserInfo_Withdrawal_Success');
  emit('success-message', successMessage.value);
};

const closePanel = () => {
  selectedPaymentMethod.value = null;
  amount.value = '';
  emit('close');
};

const validateFields = () => {
  errorMessages.value = {}

  const isDeposit = props.action === 'deposit';
  const isWithdrawal = props.action === 'withdrawal';
  const currentCashPrevious = storeUserPreferences.convertPrice(Number(userData.value?.cash), storeUserPreferences.selectedCurrency);
  const currentCash = parseFloat(currentCashPrevious.replace(/\./g, '').replace(',', '.'));
  const fieldName = isDeposit ? 'deposit' : 'withdrawal';

  if (amount.value < 10) {
    errorMessages.value[fieldName] = t(
      isDeposit ? 'UserInfo_Panel_Deposit_Low_Error' : 'UserInfo_Panel_Withdrawal_Low_Error'
    );
  } else if (isDeposit && amount.value >= 10000) {
    errorMessages.value[fieldName] = t('UserInfo_Panel_Deposit_High_Error');
  } else if (isWithdrawal && amount.value > currentCash) {
    errorMessages.value[fieldName] = t('UserInfo_Panel_Withdrawal_High_Error');
  }

  return Object.keys(errorMessages.value).length === 0
}

watch(amount, () => {
  if (!hasInteracted.value && amount.value !== '') {
    hasInteracted.value = true;
  }
  if (hasInteracted.value) {
    validateFields();
  }
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    errorMessages.value = {};
    amount.value = '';
    bankAccount.value = '';
    creditCard.value = {
      number: '',
      expiry: '',
      name: '',
      cvc: ''
    };
    googlePayEmail.value = '';
    selectedPaymentMethod.value = null;
    hasInteracted.value = false;
  }
});

const isButtonDisabled = computed(() => {
  const currentCashPrevious = storeUserPreferences.convertPrice(Number(userData.value?.cash), storeUserPreferences.selectedCurrency);
  const currentCash = parseFloat(currentCashPrevious.replace(/\./g, '').replace(',', '.'));

  if (!amount.value || amount.value < 10) return true;

  if (props.action === 'deposit') {
    if (amount.value >= 10000) return true;

    switch (selectedPaymentMethod.value) {
      case 0:
        return !bankAccount.value || bankAccount.value.length < 10;
      case 1:
        return (
          !creditCard.value.name ||
          !creditCard.value.number || creditCard.value.number.length < 16 ||
          !creditCard.value.expiry || !/^\d{2}\/\d{2}$/.test(creditCard.value.expiry) ||
          !creditCard.value.cvc || creditCard.value.cvc.length < 3
        );
      case 2:
        return !googlePayEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(googlePayEmail.value);
      default:
        return true;
    }
  }

  if (props.action === 'withdrawal') {
    return amount.value > currentCash || !bankAccount.value || bankAccount.value.length < 10;
  }

  return true;
});
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
                  <span class="panel-payment-title">{{ t('UserInfo_Panel_Bank_Transfer_Title') }}</span>
                  <span class="panel-payment-text">{{ t('UserInfo_Panel_Bank_Transfer_Text') }}</span>
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

          <div v-if="props.visible && props.action === 'withdrawal'" class="panel-payment-container">
            <span class="mdi mdi-bank-outline panel-payment-icon"></span>
            <span class="panel-payment-title">{{ t('UserInfo_Panel_Bank_Transfer_Title') }}</span>
          </div>

          <div v-if="props.action === 'deposit' && selectedPaymentMethod !== null" class="panel-payment-container">
            <div v-if="selectedPaymentMethod === 0" class="panel-payment-content">
              <span class="mdi mdi-bank-outline panel-payment-icon"></span>
              <span class="panel-payment-title">{{ t('UserInfo_Panel_Bank_Transfer_Title') }}</span>
            </div>

            <div v-else-if="selectedPaymentMethod === 1" class="panel-payment-content">
              <span class="mdi mdi-credit-card-outline panel-payment-icon"></span>
              <span class="panel-payment-title">{{ t('UserInfo_Panel_Credit_Card_Title') }}</span>
            </div>

            <div v-else-if="selectedPaymentMethod === 2" class="panel-payment-content">
              <span class="mdi mdi-google panel-payment-icon"></span>
              <span class="panel-payment-title">{{ t('UserInfo_Panel_Google_pay_Title') }}</span>
            </div>
          </div>

          <div class="panel-payment-input">
            <div v-if="selectedPaymentMethod === 0 || props.action === 'withdrawal'">
              <input
                v-model="bankAccount"
                class="payment-input-value"
                maxlength="34"
                inputmode="text"
                pattern="[A-Z0-9]*"
                :placeholder="t('UserInfo_Placeholder_Bank_Transfer')" 
              />
            </div>

            <div v-if="selectedPaymentMethod === 1">
              <div>
                <input
                  v-model="creditCard.name"
                  class="payment-input-value"
                  :placeholder="t('UserInfo_Placeholder_Card_Name')" 
                />

                <input
                  v-model="creditCard.number"
                  class="payment-input-value"
                  type="tel"
                  inputmode="numeric"
                  maxlength="16"
                  autocomplete="cc-number"
                  :placeholder="t('UserInfo_Placeholder_Card_Number')" 
                />
              </div>

              <div class="input-card-date">
                <input
                  v-model="creditCard.expiry"
                  class="payment-input-date-value"
                  type="text"
                  maxlength="5"
                  pattern="\d{2}/\d{2}"
                  autocomplete="cc-exp"
                  :placeholder="t('UserInfo_Placeholder_Card_Date')" 
                />

                <input
                  v-model="creditCard.cvc"
                  class="payment-input-date-value"
                  type="tel"
                  inputmode="numeric"
                  maxlength="4"
                  autocomplete="cc-csc"
                  :placeholder="t('UserInfo_Placeholder_Card_CVC')" 
                />
              </div>
            </div>

            <div v-if="selectedPaymentMethod === 2">
              <input
                v-model="googlePayEmail"
                class="payment-input-value"
                :placeholder="t('UserInfo_Placeholder_Google_Pay')" 
              />
            </div>
          </div>

          <div v-if="(props.action === 'withdrawal') || (props.action === 'deposit' && selectedPaymentMethod !== null)" class="panel-input">
            <input
              v-model="amount"
              class="panel-input-value"
              placeholder="0" 
            />

            <span class="panel-input-currency">
              {{ storeUserPreferences.getCurrencySymbol(storeUserPreferences.selectedCurrency) }}
            </span>
          </div>

          <div v-if="props.visible && props.action === 'withdrawal'" class="cash-available-text">
            <span>
              {{ storeUserPreferences.convertPrice(Number(userData?.cash), storeUserPreferences.selectedCurrency, 'after', true) }}
              {{ t('UserInfo_Panel_Avaiable') }}
            </span>
          </div>

          <button 
            v-if="(props.action === 'withdrawal') || (props.action === 'deposit' && selectedPaymentMethod !== null)"
            class="panel-input-btn"
            :class="storeUserPreferences.selectedTheme === 'light' ? 'panel-input-btn-hover-light' : 'panel-input-btn-hover-dark'"
            @click="props.action === 'withdrawal' ? handleWithdrawal() : handleDeposit()" 
            :disabled="isButtonDisabled"
          >
            {{ props.action === 'deposit' ? t('UserInfo_Deposit_Btn') : t('UserInfo_Withdrawal_Btn') }}
          </button>
          
          <span v-if="errorMessages.deposit || errorMessages.withdrawal" class="deposit-withdrawal-error">{{ props.action === 'deposit' ? errorMessages.deposit : errorMessages.withdrawal }}</span>
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
  background-color: v-bind(backgroundTable);
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
  background-color: var(--dark-gray-color);
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
  color: var(--gray-color);
  text-align: start;
}

.panel-payment-container {
  margin: 0 0 50px 30px;
  display: flex;
  align-items: center;
}

.panel-payment-content {
  display: flex;
  align-items: center;
}

.panel-payment-input {
  margin: 0 0 50px 30px;
}

.payment-input-value {
  font-size: 1.2rem;
  background-color: v-bind(colorGray);
  border-radius: 10px;
  color: v-bind(textColor);
  padding: 5px 20px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.336);
  margin-bottom: 15px;
}

.payment-input-value:focus {
  outline: none;
  border: none;
}

.input-card-date {
  display: flex;
}

.payment-input-date-value {
  font-size: 1.2rem;
  max-width: 40%;
  background-color: v-bind(colorGray);
  border-radius: 10px;
  color: v-bind(textColor);
  padding: 5px 20px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.336);
}

.payment-input-date-value:focus {
  outline: none;
  border: none;
}

.payment-input-date-value:not(:last-child) {
	margin-right: 30px;
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
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.336);
  text-align: end;
  padding-right: 40px;
}

.panel-input-value:focus {
  outline: none;
  border: none;
}

.panel-input-currency {
  font-size: 2rem;
  position: absolute;
  transform: translate(-30px, 13px);
}

.cash-available-text {
  font-size: 0.9rem;
  color: var(--gray-color);
  margin: 10px 0 0 30px;
}

.panel-input-btn {
  border-radius: 10px;
  background-color: var(--white-color);
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.336);
  color: var(--black-color);
  max-width: 60%;
  margin: 30px 0 0 30px;
  padding: 8px;
}

.panel-input-btn-hover-light:hover {
	background-color: var(--dark-gray-color) !important;
}

.panel-input-btn-hover-dark:hover {
  background-color: var(--white-color-hover) !important;
}

.panel-input-btn:disabled {
  background-color: var(--gray-color);
  cursor: not-allowed;
  opacity: 0.6;
}

.panel-input-btn:disabled {
  background-color: var(--white-color);
  color: var(--gray-color);
  cursor: not-allowed;
}

.deposit-withdrawal-error {
  color: var(--red-color);
  font-size: 0.95rem;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  width: 100%;
  justify-content: start;
  margin-left: 30px;
}
</style>