<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, computed } from "vue";
import { useUserPreferencesStore } from '../stores/userPreferences';
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t, locale } = useI18n()

const languages: Array<'ES' | 'EN'> = ['ES', 'EN']
const languageLabels: { [key in typeof languages[number]]: string } = {
  ES: 'Español',
  EN: 'English',
}

const currencyLabels = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  JPY: "JPY",
};

const menu = ref(false);
const languageDialog = ref(false);
const currencyDialog = ref(false);

const openLanguagePopup = () => {
  languageDialog.value = true;
}

const openCurrencyPopup = () => {
  currencyDialog.value = true;
};

const selectedLanguage = ref(storeUserPreferences.selectedLanguage);
const selectedCurrency = ref(storeUserPreferences.selectedCurrency);
const selectedTheme = ref(storeUserPreferences.selectedTheme);

const changeLanguage = (language: 'ES' | 'EN') => {
  storeUserPreferences.setSelectedLanguage(selectedLanguage.value);
  locale.value = language;
  languageDialog.value = false;
};

const changeCurrency = (currency: string) => {
  selectedCurrency.value = currency;
  storeUserPreferences.setSelectedCurrency(selectedCurrency.value);
  currencyDialog.value = false;
};

const changeTheme = () => {
  storeUserPreferences.setSelectedTheme(selectedTheme.value);
};

</script>

<template>
  <v-card height="65">
    <v-toolbar extended class="header-container">
      <div>
        <RouterLink to="/">
          <img src="@/assets/logo.png" alt="Logo" class="header-logo" />
        </RouterLink>
      </div>
      <nav>
        <RouterLink to="/" class="header-title">
          {{ t('Header_Title') }}
        </RouterLink>
        <span class="divider-bar">|</span>
        <RouterLink to="/" class="header-component">{{ t('Header_Component_1') }}</RouterLink>
        <RouterLink to="/" class="header-component">{{ t('Header_Component_2') }}</RouterLink>
        <RouterLink to="/" class="header-component">{{ t('Header_Component_3') }}</RouterLink>
      </nav>
      
      <template v-slot:append>
        <v-btn class="header-icons btn-icons">
          <v-icon>mdi-chart-pie</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_1') }}</span> 
        </v-btn>

        <v-btn class="header-icons btn-icons">
          <v-icon>mdi-star</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_2') }}</span>
        </v-btn>

        <v-btn class="header-icons btn-icons">
          <v-icon>mdi-wallet</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_3') }}</span>
        </v-btn>

        <v-card-text class="header-icons">
          <v-text-field
            class="header-icons-search"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            :placeholder="t('Header_Search')" 
            variant="solo"
            hide-details
            single-line
            bg-color="#ffffff99"
            rounded
            flat
            @click:append-inner="onClick"
            @keyup.enter=""
          ></v-text-field>
        </v-card-text>

        <v-menu v-model="menu" offset-y>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="header-icons icon-user btn-icons" icon>
              <v-icon>mdi-account-cog</v-icon>
            </v-btn>
          </template>
          <v-card class="settings-container">
            <div class="settings-options">

              <v-btn class="settings-options-btn" block @click="openLanguagePopup">{{ t('Header_Select_1') }} {{ languageLabels[locale] }}</v-btn>

              <v-btn class="settings-options-btn" block @click="openCurrencyPopup">{{ t('Header_Select_2') }} {{ currencyLabels[selectedCurrency] }}</v-btn>

              <div class="settings-options-switch">
                <span class="switch-text">{{ t('Header_Select_3') }}</span>
                <v-switch
                  v-model="selectedTheme"
                  class="switch-icon"
                  color="yellow"
                  @change="changeTheme" 
                  @click.stop      
                  :true-value="'light'"
                  :false-value="'dark'"   
                ></v-switch>
              </div>
            </div>
            <div class="settings-user">
              <v-btn class="settings-user-btn register-btn">{{ t('Header_Select_4') }}</v-btn>
              <v-btn class="settings-user-btn">{{ t('Header_Select_5') }}</v-btn>
            </div>
          </v-card>
        </v-menu>
      </template>
    </v-toolbar>
    
    <!-- Popup selector de idioma -->
    <v-dialog v-model="languageDialog" max-width="300px">
      <v-card>
        <v-card-title>{{ t('Select_Language') }}</v-card-title>
        <v-card-text>
          <v-btn
            v-for="language in languages"
            :key="language"
            block
            @click="changeLanguage(language)"
          >
            {{ languageLabels[language] }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Popup selector de moneda -->
    <v-dialog v-model="currencyDialog" max-width="300px">
      <v-card>
        <v-card-title>{{ t('Select_Currency') }}</v-card-title>
        <v-card-text>
          <v-btn
            v-for="(text, value) in currencyLabels"
            :key="value"
            block
            @click="changeCurrency(value)"
          >
            {{ text }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<style scoped>
.header-container {
  height: 65px;
  background-color: v-bind(backgroundColor);
  position: fixed;
  border-bottom: solid 1px #80808050;
}

.header-logo {
  width: 40px;
  height: 40px;
  margin-left: 20px;
  margin-top: 5px;
}

.header-title {
  font-size: 22px;
  text-decoration: none;
  color: v-bind(textColor);
  margin-right: 10px;
  padding-left: 10px;
}

.divider-bar {
  margin-right: 10px;
  color: #808080;
}

.header-component {
  font-size: 16px;
  text-decoration: none;
  color: v-bind(textColor);
  margin: 0 10px;
}

.header-component:hover {
  color: #FFD700;
}

.v-btn {
  color: white;
  text-transform: none;
}

.header-icons {
  font-size: 14px; 
  padding: 0 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
  color: v-bind(textColor);
}

.header-icons-text {
  font-size: 12px; 
  text-transform: none;
  padding-left: 5px;
  color: v-bind(textColor);
}

.header-icons-search {
  width: 250px;
  transition: background-color 0.3s;
  border-radius: 20px;
}

.header-icons-search:hover {
  background-color: #807979;
}

.icon-user {
  font-size: 20px; 
  margin-right: 10px;
  color: v-bind(textColor);
}

.btn-icons:hover {
  background-color: #ffffff22;
}

.settings-container {
  width: 300px;
  margin-top: 10px;
  background-color: rgba(49, 49, 49, 0.5) !important;
  border-radius: 10px !important;
  padding: 10px 20px;
}

.settings-options {
  padding: 20px 0;
  margin: 20px 0;
  border-bottom: solid 1px #8080803a;
  border-top: solid 1px #8080803a;
}

.settings-options-btn {
  color: white;
  background-color: transparent;
  box-shadow: none;
  border-radius: 10px;
}

.settings-options-btn:hover {
  background-color: #ffffff22;
}

.settings-options-switch, .v-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  margin-top: 10px;
}

.switch-text {
  color: white;
  font-size: 14px;
}

.settings-user {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.settings-user-btn {
  color: white;
  background-color: #ffffff22;
  box-shadow: none;
  border-radius: 10px;
  padding: 10px;
}

.settings-user-btn:hover {
  background-color: #ffffff7a;
}

.register-btn {
  margin-right: 10px;
}


</style>