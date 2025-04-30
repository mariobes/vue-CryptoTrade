<script setup lang="ts">
import { computed } from 'vue'
import UserInfo from '../components/User/UserInfo.vue'
import UserCharts from '../components/User/UserAssetCharts.vue'
// import UserAssetsTable from '../components/User/UserAssetsTable.vue'
import { useUserPreferencesStore } from '../stores/userPreferences';
import { useAuthStore } from '@/stores/auth'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const userId = storeAuth.getUserId()

</script>

<template>

<div class="main-container">
	<UserInfo></UserInfo>
	<UserCharts></UserCharts>
	<!-- <UserAssetsTable></UserAssetsTable> -->
</div>


</template>

<style scoped>
.main-container {
	max-width: 60vw;
	margin: 50px auto 30px auto;
}



</style>