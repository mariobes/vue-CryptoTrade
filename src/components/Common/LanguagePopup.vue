<script setup lang="ts">
import { computed } from "vue";
import { useUserPreferencesStore, type LanguageType } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)

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
  storeUserPreferences.setSelectedLanguage(language as LanguageType);
  locale.value = language;
  languageDialog.value = false;
  window.location.reload();
};
</script>

<template>
	<v-dialog v-model="languageDialog" width="1000px">
		<v-card class="popup-container" :style="{ background: backgroundTable }">
      <v-btn 
          icon 
          @click="languageDialog = false" 
          class="popup-close-btn" 
          :style="{ color: textColor }"
          :ripple="false"
          density="compact"
        >
          <v-icon size="25">mdi-close</v-icon>
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
							:style="{ background: backgroundTable }"
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
  text-transform: none;
}

.popup-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  box-shadow: none;
}

.popup-close-btn:hover {
  box-shadow: none !important;
  background-color: transparent !important;
}

::v-deep(.popup-close-btn .v-btn__overlay) {
  background-color: transparent !important;
}

.popup-title {
  color: var(--white-color);
  display: flex;
  justify-content: center;
  margin: 15px 50px 0 50px;
  font-size: 1.65rem;
}

.popup-text {
  box-shadow: none;
  padding: 30px 0;
}

.language-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.language-text {
  color: var(--white-color);
}

.language-label {
  color: var(--gray-color);
  margin-top: 5px;
}

.selected-icon {
  color: var(--green-color);
  padding-left: 30px;
}

/* Responsive */
@media (max-width: 800px) {
  .v-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .popup-text {
    padding: 20px 0;
  }
}
</style>