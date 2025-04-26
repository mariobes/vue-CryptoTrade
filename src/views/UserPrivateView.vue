<script setup lang="ts">
import { computed } from 'vue'
import { useUserPreferencesStore } from '../stores/userPreferences';
import { useAuthStore } from '@/stores/auth'

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const userId = storeAuth.getUserId()

</script>

<template>

<p class="text">Hola usuario con ID: {{ userId }}</p> 

</template>

<style scoped>
.text {
    color: v-bind(textColor);
}

</style>