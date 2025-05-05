<script setup lang="ts">
import UserInfo from '../components/User/UserInfo.vue'
import UserCharts from '../components/User/UserAssetCharts.vue'


</script>

<template>

<div class="main-container">
	<UserInfo></UserInfo>
	<UserCharts></UserCharts>
</div>

</template>

<style scoped>
.main-container {
	max-width: 60vw;
	margin: 50px auto 30px auto;
}
</style>