<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, computed } from "vue";
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useI18n } from 'vue-i18n'
import SettingsMenu from '@/components/Common/SettingsMenu.vue'
import SearchPopup from '@/components/Common/SearchPopup.vue'
import LanguagePopup from '@/components/Common/LanguagePopup.vue'
import CurrencyPopup from '@/components/Common/CurrencyPopup.vue'
import AuthPopup from '@/components/Common/AuthPopup.vue'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()

const languageDialog = ref(false);
const currencyDialog = ref(false);
const searchDialog = ref(false);
const authDialog = ref(false);
const selectedTab = ref<'login' | 'register'>('login')

const openLanguagePopup = () => {
  languageDialog.value = true;
}

const openCurrencyPopup = () => {
  currencyDialog.value = true;
};

const openLogin = () => {
  selectedTab.value = 'login';
  authDialog.value = true;
};

const openRegister = () => {
  selectedTab.value = 'register';
  authDialog.value = true;
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
        <RouterLink to="/cryptoTable" class="header-component">{{ t('Header_Component_Cryptos') }}</RouterLink>
        <RouterLink to="/stockTable" class="header-component">{{ t('Header_Component_Stocks') }}</RouterLink>
        <RouterLink to="/" class="header-component">{{ t('Header_Component_Exchanges') }}</RouterLink>
      </nav>
      
      <template v-slot:append>
        <v-btn class="header-icons">
          <v-icon>mdi-chart-pie</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_1') }}</span> 
        </v-btn>

        <v-btn class="header-icons">
          <v-icon>mdi-star</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_2') }}</span>
        </v-btn>

        <v-btn class="header-icons">
          <v-icon>mdi-wallet</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_3') }}</span>
        </v-btn>

        <v-btn class="header-icons header-icons-search" @click="searchDialog = true">
          <v-icon>mdi-magnify</v-icon>
          <span class="header-icons-search-text">{{ t('Header_Search') }}</span>
        </v-btn>

        <v-btn class="header-icons login-btn" @click="authDialog = true; selectedTab = 'login'">
          {{ t('Header_Select_4') }}
        </v-btn>

        <SettingsMenu 
          @open-language-popup="openLanguagePopup"
          @open-currency-popup="openCurrencyPopup"
          @open-auth-login="openLogin"
          @open-auth-register="openRegister"
        />
      </template>
    </v-toolbar>

    <!-- Popup selector de buscador -->
    <SearchPopup v-model="searchDialog" />

    <!-- Popup selector de idioma -->
    <LanguagePopup v-model="languageDialog" />

    <!-- Popup selector de moneda -->
    <CurrencyPopup v-model="currencyDialog" />

    <!-- Popup selector de auth -->
    <AuthPopup v-model="authDialog" v-model:selected-tab="selectedTab" />

  </v-card>
</template>

<style scoped>
.header-container {
  height: 65px;
  background-color: v-bind(backgroundColor);
  /* position: fixed; */
  border-bottom: solid 1px #80808050;
}

.header-logo {
  width: 40px;
  height: 40px;
  margin-left: 20px;
  margin-top: 5px;
}

.header-title {
  font-size: 1.4rem;
  text-decoration: none;
  color: v-bind(textColor);
  margin-right: 15px;
  padding-left: 10px;
}

.divider-bar {
  margin-right: 10px;
  color: #808080;
}

.header-component {
  font-size: 1.0rem;
  text-decoration: none;
  color: v-bind(textColor);
  margin: 0 10px;
}

.header-component:hover {
  color: #FF8C00;
}

.v-btn {
  color: white;
  text-transform: none;
}

.header-icons {
  font-size: 0.8rem; 
  padding: 0 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
  color: v-bind(textColor);
}

.header-icons:hover {
  background-color: #7c4e1983;
  /* ffffff54 */
}

.header-icons-text {
  font-size: 0.75rem; 
  text-transform: none;
  padding-left: 5px;
  color: v-bind(textColor);
}

.header-icons-search {
  width: 200px;
  transition: background-color 0.3s;
  margin-right: 5px;
  justify-content: start;
  font-size: 0.9rem;
  color: #9e9e9e ;
  background-color: #ffffff22;
  margin: 0 10px;
}

.header-icons-search-text {
  font-size: 0.9rem;
  color: #9e9e9e;
  margin-left: 5px;
  font-weight: normal;
}

.header-icons-search:hover {
  background-color: #a55a0452;
}

.login-btn {
  margin-right: 10px;
  color: #000000;
  background-color: #FF8C00;
  padding: 0 10px;
  font-size: 0.8rem;
  box-shadow: none;
  font-weight: bold;
}

.login-btn:hover {
  background-color: #ffd796;
  box-shadow: none;
}
</style>