<script setup lang="ts">
import { computed } from "vue";
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundTable = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const currencyDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const currencies = computed(() => storeUserPreferences.getCurrencies())

const currencyLabels = computed(() => {
  return currencies.value.reduce((acc: Record<string, string>, currency) => {
    acc[currency] = storeUserPreferences.getCurrencyLabel(currency);
    return acc;
  }, {});
});

const currencyTexts = computed(() => {
  return currencies.value.reduce((acc: Record<string, string>, currency) => {
    acc[currency] = storeUserPreferences.getCurrencyText(currency);
    return acc;
  }, {});
});

const selectedCurrency = computed(() => storeUserPreferences.selectedCurrency);

const changeCurrency = (currency: string) => {
  storeUserPreferences.setSelectedCurrency(currency);
  currencyDialog.value = false;
};
</script>

<template>
	<v-dialog v-model="currencyDialog" width="1000px">
		<v-card class="popup-container" :style="{ background: backgroundTable }">
      <v-btn 
        icon 
        @click="currencyDialog = false" 
        class="popup-close-btn" 
        :style="{ color: textColor }"
        :ripple="false"
        density="compact"
      >
        <v-icon size="25">mdi-close</v-icon>
      </v-btn>
			<v-card-title class="popup-title" :style="{ color: textColor }">
				{{ t('Header_Popup_Title_2') }}
			</v-card-title>
			<v-card-text>
				<v-row>
					<v-col v-for="(text, value) in currencyTexts" :key="value" cols="3">
						<v-btn
							class="popup-text"
							block
							@click="changeCurrency(value)"
							:style="{ background: backgroundTable }"
						>
							<div class="currency-content">
								<div class="currency-text" :style="{ color: textColor }">
									{{ text }}
								</div>
								<div class="currency-label">
									{{ currencyLabels[value] }}
								</div>
							</div>
							<v-icon v-if="value === selectedCurrency" class="selected-icon">mdi-check-circle</v-icon>
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

.currency-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.currency-text {
  color: var(--white-color);
}

.currency-label {
  color: var(--gray-color);
  margin-top: 5px;
}

.selected-icon {
  color: var(--green-color);
  padding-left: 30px;
}
</style>