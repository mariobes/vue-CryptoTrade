<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UserAssetsTable from '../User/UserAssetsTable.vue'
import DoughnutAssetsChart from '../User/DoughnutAssetsChart.vue'
import UserTransactionsTable from '../User/UserTransactionsTable.vue'
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useTransactionsStore } from '@/stores/transactions'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)

const storeUsers = useUsersStore()
const storeUserPreferences = useUserPreferencesStore()
const storeTransactions = useTransactionsStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

const activeOption = ref<'overview' | 'transactions'>('overview')

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

const combinedAssets = computed(() => {
  return [...storeTransactions.cryptos, ...storeTransactions.stocks]
})

const highestGainer = computed(() => {
  if (combinedAssets.value.length === 0) return null;
  return combinedAssets.value.reduce((max, current) =>
    current.balance > max.balance ? current : max
  );
});

const highestLoser = computed(() => {
  if (combinedAssets.value.length === 0) return null;
  return combinedAssets.value.reduce((min, current) =>
    current.balance < min.balance ? current : min
  );
});

const profitPercentage = computed(() => {
  if (!userData.value || !userData.value.wallet || userData.value.wallet === 0) return 0;
  return (userData.value.profit / userData.value.wallet) * 100;
});
</script>

<template>
<div class="main-container">
	<div class="options-content" :class="storeUserPreferences.selectedTheme === 'light' ? 'border-options-light' : 'border-options-dark'">
		<span 
			:class="['option', activeOption === 'overview' ? 'active' : '']" 
			@click="activeOption = 'overview'"
		>
			{{ t('UserInfo_Overview_Text') }}
		</span>
		<span 
			:class="['option', activeOption === 'transactions' ? 'active' : '']" 
			@click="activeOption = 'transactions'"
		>
			{{ t('UserInfo_Transactions_Text') }}
		</span>
	</div>

	<div v-if="activeOption === 'overview'" class="user-charts-container">
		<div class="mini-charts-content">

			<div class="mini-charts">

				<div class="mini-chart-item">
					<span class="item-title">{{ t('UserInfo_Chart_Historic_Benefict') }}</span>
					<span class="item-value" :style="{ color: storeUserPreferences.getPriceColor(Number(userData?.profit)) }">
						{{ Number(userData?.profit) > 0 ? '+' : '-' }}{{ storeUserPreferences.convertPrice(Math.abs(Number(userData?.profit)), storeUserPreferences.selectedCurrency, 'before', true) }}
					</span>
					<span>
						<v-icon class="item-icon mb-1" :style="{ color: storeUserPreferences.getPriceColor(profitPercentage) }">
							{{ storeUserPreferences.getArrowDirection(profitPercentage) }}
						</v-icon>
						<span :style="{ color: storeUserPreferences.getPriceColor(profitPercentage) }">
							{{ storeUserPreferences.maskedPrice(Math.abs(profitPercentage)) }}%
						</span>
					</span>
				</div>

				<div class="mini-chart-item">
					<span class="item-title">{{ t('UserInfo_Chart_Total_Invested') }}</span>
					<span class="item-value">{{ storeUserPreferences.convertPrice(Number(userData?.wallet), storeUserPreferences.selectedCurrency, 'before', true) }}</span>
					<span class="item-date"> {{ t('UserInfo_Chart_Total_Invested_Date') }} {{ userData?.creationDate ? new Date(userData.creationDate).toLocaleDateString() : '' }}</span>
				</div>

			</div>

			<div class="mini-charts">

				<div class="mini-chart-item">
					<span class="item-title">{{ t('UserInfo_Chart_Historic_Best_Performer') }}</span>
					<span class="item-asset-image">
						<img :src="highestGainer?.image" alt="Asset Logo" class="asset-image" @error="storeUserPreferences.showDefaultAssetImage(highestGainer)" />
						<span class="item-asset-text">{{ highestGainer?.symbol.toUpperCase() }}</span>
					</span>
					<span :style="{ color: storeUserPreferences.getPriceColor(Number(highestGainer?.balance)) }">
						<span class="item-asset-value">
							{{ Number(highestGainer?.balance) > 0 ? '+' : '-' }}{{ storeUserPreferences.convertPrice(Math.abs(Number(highestGainer?.balance.toFixed(2))), storeUserPreferences.selectedCurrency, 'before', true) }}
						</span>
						<v-icon class="item-icon mb-1 ml-1">
							{{ storeUserPreferences.getArrowDirection(Number(highestGainer?.balancePercentage)) }}
						</v-icon>
						<span class="item-asset-value">{{ storeUserPreferences.maskedPrice(Math.abs(Number(highestGainer?.balancePercentage))) }}%</span>
					</span>
				</div>

				<div class="mini-chart-item">
					<span class="item-title">{{ t('UserInfo_Chart_Historic_Worst_Performer') }}</span>
					<span class="item-asset-image">
						<img :src="highestLoser?.image" alt="Asset Logo" class="asset-image" @error="storeUserPreferences.showDefaultAssetImage(highestLoser)" />
						<span class="item-asset-text">{{ highestLoser?.symbol.toUpperCase() }}</span>
					</span>
					<span :style="{ color: storeUserPreferences.getPriceColor(Number(highestLoser?.balance)) }">
						<span class="item-asset-value">
							{{ Number(highestLoser?.balance) > 0 ? '+' : '-' }}{{ storeUserPreferences.convertPrice(Math.abs(Number(highestLoser?.balance.toFixed(2))), storeUserPreferences.selectedCurrency, 'before', true) }}
						</span>
						<v-icon class="item-icon mb-1 ml-1">
							{{ storeUserPreferences.getArrowDirection(Number(highestLoser?.balancePercentage)) }}
						</v-icon>
						<span class="item-asset-value">{{ storeUserPreferences.maskedPrice(Math.abs(Number(highestLoser?.balancePercentage))) }}%</span>
					</span>
				</div>

			</div>
		</div>

		<div class="chart-assets-content">
			<DoughnutAssetsChart :assets="combinedAssets" />
		</div>
	</div>

	<div v-else-if="activeOption === 'transactions'">
		<UserTransactionsTable :assets="combinedAssets" />
	</div>
	
	<div v-if="activeOption === 'overview'">
		<UserAssetsTable></UserAssetsTable>
	</div>
</div>
</template>
  
<style scoped>
.main-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	color: v-bind(textColor);
	margin-top: 20px !important;
}

.options-content {
	display: flex;
	gap: 30px;
	margin-bottom: 20px;
	color: #808080;
}

.border-options-light {
  border-bottom: solid 1px #bdbaba;
}

.border-options-dark {
  border-bottom: solid 1px #4e4e4e;
}

.option {
	cursor: pointer;
	font-weight: bold;
	padding-bottom: 5px;
}

.option.active {
	border-bottom: solid 2px #FF8C00;
	color: v-bind(textColor);
}

.user-charts-container {
	display: flex;
	margin-top: 10px;
}

.mini-charts-content {
	width: 50%;
	display: flex;
	flex-direction: column;
	gap: 30px;
	align-items: center;
}

.chart-assets-content {
	width: 42%;
	height: 280px;
	background-color: v-bind(backgroundSettings);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
	border-radius: 10px;
}

.mini-charts-profit {
	display: flex;
	gap: 30px;
}

.mini-charts {
	display: flex;
	gap: 30px;
}

.mini-chart-item {
  display: flex;
	flex-direction: column;
	background-color: v-bind(backgroundSettings);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
	border-radius: 10px;
	padding: 15px 25px;
	align-items: start;
	gap: 5px;
	font-weight: bold;
	min-width: 210px;
}

.item-title {
	color: #808080;
}

.item-value {
	font-size: 1.4rem;
}

.item-icon {
	font-size: 1.4rem;
}

.item-date {
	font-size: 0.85rem;
	color: #808080;
	margin-top: 5px;
}

.item-asset-image {
	display: flex;
	margin-top: 5px;
}

.asset-image {
  width: 25px;
  height: 25px;
  margin-right: 10px;
  border-radius: 50%;
}

.item-asset-text {
	font-size: 1.2rem;
}

.item-asset-value {
	font-size: 0.95rem;
}
</style>