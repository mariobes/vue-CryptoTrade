<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserPreferencesStore } from '@/stores/userPreferences';
import type { UserAssetsSummary } from '@/core/transaction'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const $router = useRouter()
const { t } = useI18n()

const tableSelected = ref<'all' | 'cryptos' | 'stocks'>('all')

const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

onMounted(async () => {
	await storeTransactions.GetAssets(userId, token);
});

const filteredAssets = computed(() => {
  if (tableSelected.value === 'cryptos') {
    return storeTransactions.assets.filter(asset => asset.typeOfAsset === 'Crypto');
  }
  if (tableSelected.value === 'stocks') {
    return storeTransactions.assets.filter(asset => asset.typeOfAsset === 'Stock');
  }
  return storeTransactions.assets;
});

const hasAssets = computed(() => {
  if (tableSelected.value === 'cryptos') {
    return storeTransactions.assets.some(asset => asset.typeOfAsset === 'Crypto');
  }
  if (tableSelected.value === 'stocks') {
    return storeTransactions.assets.some(asset => asset.typeOfAsset === 'Stock');
  }
  return storeTransactions.assets.length > 0;
});

function goToAsset(asset: UserAssetsSummary) {
  const route = asset.typeOfAsset === 'Crypto' ? 'cryptoDetails' : 'stockDetails';
  $router.push({ name: route, params: { id: asset.assetId } });
}
</script>

<template>
	<div class="main-container">
		<div class="tables-content">
			<span 
				:class="['table', tableSelected === 'all' ? 'selected' : '']" 
				@click="tableSelected = 'all'"
			>
				{{ t('UserInfo_All_Text') }}
			</span>

			<span 
				:class="['table', tableSelected === 'cryptos' ? 'selected' : '']" 
				@click="tableSelected = 'cryptos'"
			>
				{{ t('UserInfo_Cryptocurrencies_Text') }}
			</span>

			<span 
				:class="['table', tableSelected === 'stocks' ? 'selected' : '']" 
				@click="tableSelected = 'stocks'"
			>
				{{ t('UserInfo_Stocks_Text') }}
			</span>
		</div>

		<v-table v-if="hasAssets" class="table-container">
			<thead>
				<tr>
					<th class="text-left column-fixed">{{ t('UserInfo_Table_Name') }}</th>
					<th class="text-right">{{ t('UserInfo_Table_Price') }}</th>
					<th class="text-right">{{ t('UserInfo_Table_24h') }}</th>
					<th class="text-right">{{ t('UserInfo_Table_Holdings') }}</th>
					<th class="text-right">{{ t('UserInfo_Table_Purchase_Price') }}</th>
					<th class="text-right">{{ t('UserInfo_Table_Profit_Loss') }}</th>
					<th class="text-right">{{ t('UserInfo_Table_Percentage') }}</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="asset in filteredAssets"        
					:key="asset.assetId"
					:class="storeUserPreferences.selectedTheme === 'light' ? 'hover-light' : 'hover-dark'"
					@click="goToAsset(asset)"
					style="cursor: pointer"
				>
					<td>
						<div class="asset-container">
							<img :src="asset.image" alt="Asset Logo" 
								class="asset-image" 
								:class="{ 'stock-image-light': storeUserPreferences.selectedTheme === 'light' && asset.typeOfAsset === 'Stock' }"
								@error="storeUserPreferences.showDefaultAssetImage(asset)"
							/>
							<span class="asset-name">{{ asset.name }}</span>
							<span class="asset-symbol">{{ asset.symbol.toUpperCase() }}</span>	
						</div>
					</td>
					<td class="text-right">
						{{ storeUserPreferences.convertPrice(asset.price, storeUserPreferences.selectedCurrency, 'before') }}
					</td>
					<td class="text-right" :style="{ color: storeUserPreferences.getPriceColor(asset.changesPercentage24h) }">
						<v-icon class="mb-1">
							{{ storeUserPreferences.getArrowDirection(asset.changesPercentage24h) }}
						</v-icon>
						{{ Math.abs(asset.changesPercentage24h).toFixed(2) }}%
					</td>
					<td class="text-right">
						<div class="asset-total">
							<span>
								{{ storeUserPreferences.convertPrice(Number(asset.total.toFixed(2)), storeUserPreferences.selectedCurrency, 'before', true) }}
							</span>
							<span class="asset-total-amount-asset">
								{{ storeUserPreferences.convertAssetAmount(asset.totalAssetAmount, true) }} {{ asset.symbol.toUpperCase() }}
							</span>
						</div>
					</td>
					<td class="text-right">{{ storeUserPreferences.convertPrice(asset.averagePurchasePrice, storeUserPreferences.selectedCurrency, 'before', true) }}</td>
					<td class="text-right">
						<div class="asset-profit">
							<span :style="{ color: storeUserPreferences.getPriceColor(asset.balance) }">
								{{ asset.balance > 0 ? '+' : '' }}{{ storeUserPreferences.convertPrice(Number(asset.balance.toFixed(2)), storeUserPreferences.selectedCurrency, 'after', true) }}
							</span>
							<div :style="{ color: storeUserPreferences.getPriceColor(asset.balancePercentage) }">
								<v-icon class="mb-1">
									{{ storeUserPreferences.getArrowDirection(asset.balancePercentage) }}
								</v-icon>
								<span>
									{{ storeUserPreferences.maskedPrice(Math.abs(asset.balancePercentage)) }}%
								</span>	
							</div>
						</div>
					</td>
					<td class="text-right">{{ storeUserPreferences.maskedPrice(asset.walletPercentage) }}%</td>
				</tr>
			</tbody>
		</v-table>
	</div>
</template>
  
<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	color: v-bind(textColor);
}

.tables-content {
	display: flex;
	gap: 30px;
	margin: 15px 0;
}

.table {
	cursor: pointer;
	padding-bottom: 5px;
}

.table.selected {
	border-bottom: solid 2px var(--primary-color);
	color: v-bind(textColor);
	font-weight: bold;
}

.table-selected-content {
	padding: 10px 0;
}

.table-container {
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
}

.column-fixed {
  width: 300px;
}

.v-table thead th {
  border-bottom: solid 1px var(--dark-gray-color) !important;
}

.v-table tbody td {
  border-bottom: solid 1px var(--dark-gray-color) !important;
  padding: 25px 16px !important; 
  font-size: 1.0rem !important;
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
  width: 30px;
  height: 30px;
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
  max-width: 120px;
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

.asset-total {
	display: flex;
	flex-direction: column;
	font-weight: bold;
}

.asset-total-amount-asset {
	font-size: 0.85rem;
	color: var(--gray-color);
	font-weight: bold;
}

.asset-profit {
	display: flex;
	flex-direction: column;
	font-weight: bold;
}
</style>