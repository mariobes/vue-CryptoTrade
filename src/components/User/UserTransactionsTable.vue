<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Transaction, UserAssetsSummary } from '@/core/transaction'
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const $router = useRouter()
const { t } = useI18n()

const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const props = defineProps({
  assets: {
    type: Array as PropType<UserAssetsSummary[]>,
    required: true
  }
})

const getPaymentTranslation = (payment: string | null) => {
  const map: Record<string, string> = {
    'Bank transfer': t('UserInfo_Panel_Bank_Transfer_Title'),
    'Credit card': t('UserInfo_Panel_Credit_Card_Title'),
    'Google Pay': t('UserInfo_Panel_Google_pay_Title')
  }
  return map[payment ?? ''] ?? payment
}

onMounted(async () => {
  await storeTransactions.GetTransactions(userId, token)
})

const assetMap = computed(() => {
  const map = new Map<string, UserAssetsSummary>();
  for (const asset of props.assets) {
    map.set(asset.assetId, asset);
  }
  return map;
});

function goToAsset(asset: Transaction) {
  const route = asset.typeOfAsset === 'Crypto' ? 'cryptoDetails' : 'stockDetails';
  $router.push({ name: route, params: { id: asset.assetId } });
}
</script>

<template>
  <v-table class="table-container">
    <thead>
      <tr>
        <th class="text-left">{{ t('UserInfo_Transactions_Table_Type') }}</th>
        <th class="text-left">{{ t('UserInfo_Transactions_Table_Date') }}</th>
				<th class="text-left">{{ t('UserInfo_Transactions_Table_Asset_Payment') }}</th>
				<th class="text-right"> {{ t('UserInfo_Transactions_Table_Purchase_Price') }}</th>
				<th class="text-right">{{ t('UserInfo_Transactions_Table_Amount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="transaction in storeTransactions.transactions.slice().reverse()"
        :key="transaction.id"
        :class="[
          !assetMap.get(transaction.assetId) ? '' : storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'
        ]"
        @click="assetMap.get(transaction.assetId) && goToAsset(transaction)"
        :style="{
          cursor: assetMap.get(transaction.assetId) ? 'pointer' : 'default',
        }"
      >
        <td class="column-fixed-type">
					<div v-if="transaction.concept === '+ Deposit'" class="transaction-type">
						<span class="transaction-icon mdi mdi-plus-circle-outline"></span>
						<span class="transaction-text">{{ t('UserInfo_Transactions_Table_Deposit') }}</span>
					</div>
					<div v-else-if="transaction.concept === '- Withdrawal'" class="transaction-type">
						<span class="transaction-icon mdi mdi-minus-circle-outline"></span>
						<span class="transaction-text">{{ t('UserInfo_Transactions_Table_Withdrawal') }}</span>
					</div>
					<div v-else-if="transaction.concept.startsWith('+')" class="transaction-type">
						<span class="transaction-icon mdi mdi-swap-horizontal-circle" style="color: green;"></span>
						<span class="transaction-text">{{ t('UserInfo_Transactions_Table_Buy') }}</span>
					</div>
					<div v-else-if="transaction.concept.startsWith('-')" class="transaction-type">
						<span class="transaction-icon mdi mdi-swap-horizontal-circle" style="color: red;"></span>
						<span class="transaction-text">{{ t('UserInfo_Transactions_Table_Sell') }}</span>
					</div>
				</td>
        <td class="column-fixed-date">
					<span class="transaction-date">
						{{ new Date(transaction.date).toDateString() }}
					</span>
				</td>
				<td>
					<div v-if="assetMap.get(transaction.assetId)?.name != null" class="asset-container">
						<img :src="assetMap.get(transaction.assetId)?.image" alt="Asset Logo" 
							class="asset-image" 
							:class="{ 'stock-image-light': storeUserPreferences.selectedTheme === 'light' && transaction.typeOfAsset === 'Stock' }"
							@error="storeUserPreferences.showDefaultAssetImage(assetMap.get(transaction.assetId)?.image)" 
						/>
						<span class="asset-name">{{ assetMap.get(transaction.assetId)?.name }}</span>
						<span class="asset-symbol">{{ assetMap.get(transaction.assetId)?.symbol.toUpperCase() }}</span>
					</div>
					<div v-else>{{ getPaymentTranslation(transaction.paymentMethod) }}</div>
				</td>
				<td class="text-right">
					{{ assetMap.get(transaction.assetId)?.price != null ? 
								storeUserPreferences.convertPrice(transaction.purchasePrice, storeUserPreferences.selectedCurrency, 'before', true)
						 : '- - -' }}
				</td>
				<td class="text-right">
					<div>
						<div v-if="transaction.concept === '+ Deposit' || transaction.concept === '- Withdrawal'">
							<span class="total-amount-deposit">
								{{ storeUserPreferences.convertPrice(transaction.amount, storeUserPreferences.selectedCurrency, 'before', true) }}
							</span>
						</div>
						<div v-else class="transaction-amount">
              <span :style="{ color: transaction.concept.startsWith('+') ? 'green' : 'red' }">
								{{ transaction.concept.startsWith('+') ? '+' : '-' }}{{ storeUserPreferences.convertAssetAmount(Math.abs(transaction.assetAmount), true) }} {{ assetMap.get(transaction.assetId)?.symbol.toUpperCase() }}
							</span>
							<span class="total-amount">
								{{ storeUserPreferences.convertPrice(transaction.amount, storeUserPreferences.selectedCurrency, 'before', true) }}
							</span>
						</div>
					</div>
				</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped>
.table-container {
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
  margin-bottom: 15px;
}

.column-fixed-type {
  width: 200px;
}

.column-fixed-date {
  width: 260px;
}

.transaction-type {
	display: flex;
	align-items: center;
}

.transaction-icon {
	font-size: 1.8rem;
	margin-right: 5px;
}

.transaction-text {
	font-weight: bold;
}

.transaction-date {
	color: var(--gray-color);
	font-weight: bold;
	font-size: 0.9rem;
}

.v-table thead th {
  border-bottom: solid 1px var(--dark-gray-color) !important;
}

.v-table tbody td {
  border-bottom: solid 1px var(--dark-gray-color) !important;
  padding: 10px 16px !important; 
  font-size: 1.0rem !important;
}

.v-table tbody tr {
  height: 70px !important;
}

.hover-light:hover {
  background-color: var(--table-color-hover-light) !important;
}

.hover-dark:hover {
  background-color: var(--table-color-hover-dark) !important;
}

.asset-container {
  display: flex;
  align-items: center;
}

.asset-image {
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 50%;
}

.stock-image-light {
  background-color: var(--background-stock-image);
  border: solid 1px var(--background-stock-image);
}

.asset-name {
  margin-right: 10px;
  padding-top: 2px;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
}

.asset-symbol {
  padding-top: 2px;
  font-size: 0.85rem;
  color: var(--gray-color);
  white-space: nowrap;
  font-weight: bold;
}

.total-amount-deposit {
	font-weight: bold;
}

.transaction-amount {
	display: flex;
	flex-direction: column;
	font-weight: bold;
}

.total-amount {
	font-size: 0.85rem;
}
</style>