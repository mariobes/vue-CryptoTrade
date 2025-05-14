<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, computed, watch } from "vue";
import { useRoute } from 'vue-router'
import router from '@/router'
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import SettingsMenu from '@/components/Common/SettingsMenu.vue'
import SearchPopup from '@/components/Common/SearchPopup.vue'
import LanguagePopup from '@/components/Common/LanguagePopup.vue'
import CurrencyPopup from '@/components/Common/CurrencyPopup.vue'
import AuthPopup from '@/components/Common/AuthPopup.vue'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)
const textColor = computed(() => storeUserPreferences.getTheme().text)
const grayColor = computed(() => storeUserPreferences.getTheme().colorGray)
const darkGrayColor = computed(() => storeUserPreferences.getTheme().colorDarkGray)

const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const { t } = useI18n()
const route = useRoute()

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

const handlePortfolioClick = () => {
  if (storeAuth.isLoggedIn()) {
    router.push({ name: 'userPrivate', params: { id: storeAuth.getUserId() } })
  } else {
    selectedTab.value = 'login'
    authDialog.value = true
  }
}

const handleWatchlistClick= () => {
  if (storeAuth.isLoggedIn()) {
    router.push({ name: 'watchlistTable', params: { id: storeAuth.getUserId() } })
  } else {
    selectedTab.value = 'login'
    authDialog.value = true
  }
}

watch(
  () => route.query.auth,
  (newVal) => {
    if (newVal === 'true') {
      authDialog.value = true
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-card height="65">
    <v-toolbar extended class="header-container">
      <div>
        <RouterLink to="/">
          <img src="@/assets/logo.jpg" alt="Logo" class="header-logo" />
        </RouterLink>
      </div>
      <nav>
        <RouterLink to="/" class="header-title">{{ t('Header_Title') }}</RouterLink>
        <span class="divider-bar">|</span>
        <RouterLink to="/cryptoTable" class="header-component">{{ t('Header_Component_Cryptos') }}</RouterLink>
        <RouterLink to="/stockTable" class="header-component">{{ t('Header_Component_Stocks') }}</RouterLink>
        <RouterLink to="/descentralizedWallet" target="_blank" class="header-component">{{ t('Header_Component_Wallet') }}</RouterLink>
        
        <v-menu open-on-hover content-class="header-component-menu" :style="{ color: backgroundTable }">
          <template v-slot:activator="{ props }">
            <RouterLink to="" class="header-component" v-bind="props">{{ t('Header_Component_Documentation') }}</RouterLink>
          </template>
          <v-list class="menu-container" :style="{ background: backgroundTable, color: textColor }">
            <v-list-item>
                <v-list-item-title class="menu-container-item">
                  <a href="https://www.coingecko.com/en/api" target="_blank" class="menu-container-item-link">
                    CoinGeko API
                  </a>
                </v-list-item-title>
                <v-list-item-title class="menu-container-item">
                  <a href="https://coinmarketcap.com/api" target="_blank" class="menu-container-item-link">
                    CoinMarketCap API
                  </a>
                </v-list-item-title>
                <v-list-item-title class="menu-container-item">
                  <a href="https://site.financialmodelingprep.com/developer/docs" target="_blank" class="menu-container-item-link">
                    Financial Modeling Prep API
                  </a>
                </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </nav>
      
      <template v-slot:append>
        <v-btn class="header-icons" @click="handlePortfolioClick">
          <v-icon>mdi-chart-pie</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_Portfolio') }}</span> 
        </v-btn>

        <v-btn class="header-icons" @click="handleWatchlistClick">
          <v-icon>mdi-star</v-icon>
          <span class="header-icons-text">{{ t('Header_Icon_Watchlist') }}</span>
        </v-btn>

        <v-btn class="header-icons header-icons-search" @click="searchDialog = true">
          <v-icon>mdi-magnify</v-icon>
          <span class="header-icons-search-text">{{ t('Header_Search') }}</span>
        </v-btn>

        <v-btn 
          v-if="!storeAuth.isLoggedIn()"
          class="header-icons login-btn" 
          @click="authDialog = true; selectedTab = 'login'"
        >
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

    <SearchPopup v-model="searchDialog" />

    <LanguagePopup v-model="languageDialog" />

    <CurrencyPopup v-model="currencyDialog" />

    <AuthPopup v-model="authDialog" v-model:selected-tab="selectedTab" />

  </v-card>
</template>

<style scoped>
.header-container {
  height: 65px;
  background-color: v-bind(backgroundColor);
  border-bottom: solid 1px var(--dark-gray-color);
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
  margin-right: 20px;
  padding-left: 10px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}

.divider-bar {
  margin-right: 10px;
  color: var(--gray-color);
}

.header-component {
  font-size: 1.1rem;
  text-decoration: none;
  color: v-bind(textColor);
  margin: 0 20px;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}

.header-component:hover {
  color: var(--primary-color);
}

a {
  text-decoration: none;
  color: v-bind(textColor);
}

::v-deep(.header-component-menu)::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 11px solid;
  z-index: 1;
}

.menu-container {
  border-radius: 10px !important;
  margin-top: 15px;
  padding: 5px 0;
}

.menu-container-item {
  padding: 5px 0px;
  font-size: 0.9rem;
}

.menu-container-item-link {
  display: inline-block;
  width: 100%;
}

.menu-container-item-link:hover {
  color: var(--primary-color);
}

.v-btn {
  text-transform: none;
}

.header-icons {
  font-size: 0.8rem; 
  padding: 0 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
  color: v-bind(textColor);
  font-weight: bold;
}

.header-icons:hover {
  background-color: var(--primary-color-brown-hover);
}

.header-icons-text {
  font-size: 0.75rem; 
  text-transform: none;
  padding-left: 5px;
  color: v-bind(textColor);
  font-family: 'Montserrat', sans-serif;
}

.header-icons-search {
  width: 250px;
  transition: background-color 0.3s;
  margin-right: 5px;
  justify-content: start;
  font-size: 0.9rem;
  color: var(--gray-color);
  background-color: v-bind(grayColor);
  margin: 0 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.header-icons-search-text {
  font-size: 0.9rem;
  color: var(--gray-color);
  margin-left: 5px;
  font-weight: normal;
}

.header-icons-search:hover {
  background-color: var(--primary-color-brown-hover);
}

.login-btn {
  margin-right: 10px;
  color: var(--black-color);
  background-color: var(--primary-color);
  padding: 0 10px;
  font-size: 0.8rem;
  box-shadow: none;
  font-weight: bold;
}

.login-btn:hover {
  background-color: var(--primary-color-light-hover);
  box-shadow: none;
}

/* Responsive */
@media (max-width: 1600px) {
  .header-icons {
    display: none;
  }

  .header-icons-search {
    display: flex;
    width: 250px;
  }
}

@media (max-width: 1300px) {
  .header-icons-search {
    display: none;
  }
}

@media (max-width: 1100px) {
  .header-component {
    display: none;
  }

  .header-icons {
    display: flex;
  }
}

@media (max-width: 850px) {
  .header-icons {
    display: none;
  }

  .header-icons-search {
    display: flex;
    width: 150px;
  }
}
</style>