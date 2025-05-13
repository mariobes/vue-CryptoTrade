<script setup lang="ts">
import UserInfo from '../components/User/UserInfo.vue'
import UserCharts from '../components/User/UserAssetCharts.vue'
</script>

<template>
	<div class="main-container">
		<UserInfo></UserInfo>
		<UserCharts class="container-item"></UserCharts>
	</div>
</template>

<style scoped>
.main-container {
	max-width: 60vw;
	margin: 50px auto 30px auto;
}

/* Responsive */
@media (max-width: 1900px) {
	.main-container {
		max-width: 70vw;
	}
}

@media (max-width: 1650px) {
	.main-container {
		max-width: 80vw;
	}
}

@media (max-width: 1400px) {
	.main-container {
		max-width: 95vw;
	}
}
</style>