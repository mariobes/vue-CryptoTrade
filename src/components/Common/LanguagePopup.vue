<script setup lang="ts">
import { computed } from "vue";
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)

const storeUserPreferences = useUserPreferencesStore()

const { t, locale } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const languageDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const languageLabels = computed(() => {
  const languages = storeUserPreferences.getLanguages();
  return languages.reduce((acc: Record<string, string>, lang) => {
    acc[lang] = storeUserPreferences.getLanguageLabel(lang);
    return acc;
  }, {});
});

const selectedLanguage = computed(() => storeUserPreferences.selectedLanguage);

const changeLanguage = (language: string) => {
  storeUserPreferences.setSelectedLanguage(language);
  locale.value = language;
  languageDialog.value = false;
};
</script>

<template>
	<v-dialog v-model="languageDialog" width="1000px">
		<v-card class="popup-container" :style="{ background: backgroundSettings }">
			<v-btn icon @click="languageDialog = false" class="popup-close-btn" :style="{ color: textColor }">
				<v-icon>mdi-close</v-icon>
			</v-btn>
			<v-card-title class="popup-title" :style="{ color: textColor }">
				{{ t('Header_Popup_Title_1') }}
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col v-for="(text, value) in languageLabels" :key="value" cols="3">
						<v-btn
							class="popup-text"
							block
							@click="changeLanguage(value)"
							:class="{ 'selected-value': value === selectedLanguage }"
							:style="{ background: backgroundSettings }"
						>
							<div class="language-content">
								<div class="language-text" :style="{ color: textColor }">
									{{ text }}
								</div>
								<div class="language-label">
									{{ value }}
								</div>
							</div>
							<v-icon v-if="value === selectedLanguage" class="selected-icon">mdi-check-circle</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<style scoped>
.popup-container {
  border-radius: 10px !important;
}

.v-btn {
  color: white;
  text-transform: none;
}

.popup-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  box-shadow: none;
}

.popup-title {
  color: #ffffff;
  display: flex;
  justify-content: center;
  margin: 15px 50px 0 50px;
  font-size: 1.65rem;
}

.popup-text {
  color: #ffffff;
  background-color: #232323;
  box-shadow: none;
  padding: 30px 0;
}

.selected-value {
  background-color: #4b4a4a;
}

.language-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.language-text {
  color: #ffffff;
}

.language-label {
  color: #808080;
  margin-top: 5px;
}

.selected-icon {
  color: green;
  padding-left: 30px;
}
</style>