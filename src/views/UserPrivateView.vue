<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserPreferencesStore } from '../stores/userPreferences';

const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const route = useRoute()
const userId = computed(() => route.params.id)


</script>

<template>

<p class="text">Hola usuario con ID: {{ userId }}</p> 

</template>

<style scoped>
.text {
    color: v-bind(textColor);
}

</style>