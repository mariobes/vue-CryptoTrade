<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UserAssetsTable from '../User/UserAssetsTable.vue'
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

	<div class="option-active-content">
		<div v-if="activeOption === 'overview'" class="user-charts-container">
			<div class="mini-charts-content">

				<div class="mini-charts-profit">

					<div class="mini-chart-item">
						<span>Beneficio histórico</span>
						<span>{{ userData?.profit }}</span>
						<span>-98.95%</span>
					</div>

					<div class="mini-chart-item">
						<span>Total invertido</span>
						<span>{{ userData?.wallet }}</span>
					</div>

				</div>

				<div class="mini-charts-assets">

					<div class="mini-chart-item">
						<span>Mayor ganancia</span>
						{{ highestGainer?.name }}
						<!-- <span>
							<img :src="highestGainer?.image" alt="Asset Logo" class="asset-image" @error="storeUserPreferences.showDefaultAssetImage(highestGainer)" />
							<span>{{ highestGainer?.symbol }}</span>
						</span>
						<span>{{ highestGainer?.balance }} {{ highestGainer?.balancePercentage }}%</span> -->
					</div>

					<div class="mini-chart-item">
						<span>Mayor pérdida</span>
						{{ highestLoser?.name }}
						<!-- <span>
							<img :src="highestLoser?.image" alt="Asset Logo" class="asset-image" @error="storeUserPreferences.showDefaultAssetImage(highestLoser)" />
							<span>{{ highestLoser?.symbol }}</span>
						</span>
						<span>{{ highestLoser?.balance }} {{ highestLoser?.balancePercentage }}%</span> -->
					</div>

				</div>
			</div>
			<div class="chart-assets-content">
				Gráfica
			</div>
		</div>
		<div v-else-if="activeOption === 'transactions'">
			<div>Componente Transacciones</div>
		</div>
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
	gap: 20px;
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

.option-active-content {
	padding: 10px 0;
}

.user-charts-container {
	display: flex;
	justify-content: space-between;

}

.mini-charts-content {
	width: 50%;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.chart-assets-content {
	width: 50%;
}

.mini-charts-profit {
	display: flex;
	gap: 10px;
}

.mini-charts-assets {
	display: flex;
	gap: 10px;
}

.mini-chart-item {
	width: 50%;
  display: flex;
	flex-direction: column;
	background-color: v-bind(backgroundSettings);
	border-radius: 10px;
	padding: 20px 0 20px 50px;
	align-items: start;
}



.asset-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}




</style>