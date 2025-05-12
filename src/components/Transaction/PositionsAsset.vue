<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserPreferencesStore } from '@/stores/userPreferences'
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const storeUserPreferences = useUserPreferencesStore()
const storeUsers = useUsersStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const props = defineProps<{ assetId: string, typeOfAsset: string }>()

const userAsset = computed(() => {
  return storeTransactions.assets.find(a => a.assetId === props.assetId);
});

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
</script>

<template>
  <div class="main-container">
    <div v-if="!storeAuth.isLoggedIn()" class="positions-message">
      <span>{{ t('TransactionsAsset_Logout_Message') }}</span>
    </div>

    <div v-if="storeAuth.isLoggedIn() && !userAsset" class="positions-message">
      <span>{{ t('TransactionsAsset_Position_Message') }}</span>
    </div>

    <div v-if="storeAuth.isLoggedIn() && userAsset" class="positions-container">
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
          {{ storeUserPreferences.convertPrice(userAsset.total, storeUserPreferences.selectedCurrency, 'after', true) }}
        </span>
      </div>

      <div class="positions-profit-content">
        <span class="positions-text">{{ t('TransactionsAsset_Profitability_Text') }}</span>
        <span class="positions-profit-value" :style="{ color: storeUserPreferences.getPriceColor(userAsset.balance) }">
          <v-icon class="positions-profit-icon mb-1">
            {{ storeUserPreferences.getArrowDirection(userAsset.balance) }}
          </v-icon>
          <span class="mr-2">{{ storeUserPreferences.convertPrice(Math.abs(userAsset.balance), storeUserPreferences.selectedCurrency, 'after', true) }}</span>
          <span>
            ({{ userAsset.balancePercentage > 0 ? '+' : '-' }} {{ storeUserPreferences.maskedPrice(Math.abs(userAsset.balancePercentage)) }} %)
          </span>
        </span>
      </div>

      <div class="positions-info-content">
        <div class="positions-info-assets">
          <span class="positions-text">{{ t('TransactionsAsset_Actives_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.convertAssetAmount(userAsset.totalAssetAmount, true) }}</span>
        </div>
        <div class="positions-info-purchase-price">
          <span class="positions-text">{{ t('TransactionsAsset_Purchase_Price_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.convertPrice(userAsset.averagePurchasePrice, storeUserPreferences.selectedCurrency, 'after', true) }}</span>
        </div>
        <div class="positions-info-percentage">
          <span class="positions-text">{{ t('TransactionsAsset_Purchase_Percentage_Text') }}</span>
          <span class="positions-info-value">{{ storeUserPreferences.maskedPrice(userAsset.walletPercentage) }} %</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
  padding: 0 50px 50px 50px;
}

.positions-message {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--gray-color);
  margin-top: 30px;
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
  color: var(--gray-color);
}

.positions-text {
  font-size: 0.9rem;
  color: var(--gray-color);
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
}

.positions-info-percentage {
  display: flex;
  flex-direction: column;
  max-width: 30%;
  justify-content: space-between;
}
</style>