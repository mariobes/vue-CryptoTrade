<script setup lang="ts">
import { computed } from 'vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const { t } = useI18n()

const storeUserPreferences = useUserPreferencesStore()

</script>

<template>
	<div class="main-container">
		<div class="text">CryptoTrade</div>
	</div>
</template>

<style scoped>
.main-container {
	background-color: v-bind(backgroundColor);
	padding: 20px 50px;
	border-top: solid 1px #80808050;
}

.text {
    color: v-bind(textColor);
}
</style>