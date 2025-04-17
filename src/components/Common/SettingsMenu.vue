<script setup lang="ts">
import { ref, computed } from "vue";
import router from '@/router'
import { useUserPreferencesStore } from '../../stores/userPreferences';
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)

const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const { t, locale } = useI18n()

const languageLabels = computed(() => {
  const languages = storeUserPreferences.getLanguages();
  return languages.reduce((acc: Record<string, string>, lang) => {
    acc[lang] = storeUserPreferences.getLanguageLabel(lang);
    return acc;
  }, {});
});

const currencyLabels = computed(() => {
  const currencies = computed(() => storeUserPreferences.getCurrencies())
  return currencies.value.reduce((acc: Record<string, string>, currency) => {
    acc[currency] = storeUserPreferences.getCurrencyLabel(currency);
    return acc;
  }, {});
});

const selectedCurrency = computed(() => storeUserPreferences.selectedCurrency);
const selectedTheme = ref(storeUserPreferences.selectedTheme);

const menu = ref(false);
const selectedTab = ref<'login' | 'register'>('login')

const changeTheme = () => {
  storeUserPreferences.setSelectedTheme(selectedTheme.value);
};

const emit = defineEmits(['open-language-popup', 'open-currency-popup', 'open-auth-login', 'open-auth-register']);

const openLanguagePopup = () => {
	emit('open-language-popup');
}

const openCurrencyPopup = () => {
	emit('open-currency-popup');
};

const openAuthLogin = () => {
	emit('open-auth-login');
}

const openAuthRegister = () => {
	emit('open-auth-register');
}

const handleLogout = async () => {
  storeAuth.logout();
  router.push('/')
}
</script>

<template>
	<v-menu v-model="menu" offset-y>
		<template v-slot:activator="{ props }">
			<v-btn v-bind="props" class="header-icons icon-user" icon>
				<v-icon>mdi-account-cog</v-icon>
			</v-btn>
		</template>
		<v-card class="settings-container" :style="{ backgroundColor: backgroundSettings, color: textColor }">
			<div class="settings-user">
        <v-btn 
          v-if="storeAuth.isLoggedIn()"
          class="header-icons login-btn" 
          @click="handleLogout()"
        >
        {{ t('Header_Popup_Auth_Logout') }}
        </v-btn>

				<v-btn 
          v-if="!storeAuth.isLoggedIn()"
          class="settings-user-btn login-btn" 
          @click="() => { openAuthLogin(); selectedTab = 'login'; }"
        >
					{{ t('Header_Select_4') }}
				</v-btn>
				<v-btn 
          v-if="!storeAuth.isLoggedIn()"
          class="settings-user-btn register-btn" 
          @click="() => { openAuthRegister(); selectedTab = 'register'; }"
        >
					{{ t('Header_Select_5') }}
				</v-btn>
			</div>

			<div class="settings-options">
				<div class="settings-options-buttons-language">
					<button class="settings-options-btn" @click="openLanguagePopup">
						<span class="settings-options-text">{{ t('Header_Select_1') }}</span>
						<span class="settings-options-value">
							{{ languageLabels[locale] }}
							<v-icon class="pt-1 settings-options-arrow">mdi-chevron-right</v-icon> 
						</span>
					</button>
				</div>

				<div class="settings-options-buttons-currency">
					<button class="settings-options-btn" @click="openCurrencyPopup">
						<span class="settings-options-text">{{ t('Header_Select_2') }}</span>
						<span class="settings-options-value">
							{{ currencyLabels[selectedCurrency] }}
							<v-icon class="pt-1 settings-options-arrow">mdi-chevron-right</v-icon> 
						</span>
					</button>
				</div>

				<div class="settings-options-switch">
					<span class="switch-text">
						{{ t('Header_Select_3') }}
					</span>
					<v-switch
						v-model="selectedTheme"
						class="switch-icon"
						color="#FF8C00"
						@change="changeTheme" 
						@click.stop      
						:true-value="'dark'"
						:false-value="'light'"   
					></v-switch>
				</div>
			</div>
		</v-card>
	</v-menu>
</template>

<style scoped>
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
}

.icon-user {
  font-size: 1.3rem; 
  margin-right: 10px;
  color: v-bind(textColor);
}

.settings-container {
  width: 300px;
  margin-top: 10px;
  border-radius: 10px !important;
  padding: 10px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336) !important;
}

.settings-user {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.settings-user-btn {
  background-color: transparent;
  border-radius: 10px;
  padding: 0 15px;
  margin-top: 5px;
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

.register-btn {
  color: #FF8C00;
  border: solid 1px #FF8C00;
  padding: 0 10px;
  box-shadow: none;
}

.register-btn:hover {
  background-color: #ffd79621;
}

.settings-options {
  padding: 10px 0 20px 0;
  margin-top: 20px;
  border-top: solid 1px #8080803a;
}

.settings-options-btn {
  font-size: 0.85rem;
  border-radius: 10px;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.settings-options-value {
  display: flex;
  color: #808080;
}

.settings-options-arrow {
  color: #808080;
  font-size: 1.0rem;
}

.settings-options-btn:hover {
  background-color: #ffffff22;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.336);
}

.settings-options-buttons-currency {
  padding-top: 5px;
}

.settings-options-switch, .v-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  margin-top: 10px;
}

.switch-text {
  font-size: 0.85rem;
  height: 10px;
  margin-left: 12px;
}

.switch-icon {
  margin-right: 10px;
}
</style>