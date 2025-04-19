<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import router from '@/router'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)

const { t } = useI18n()

const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const props = defineProps<{
  modelValue: boolean
  selectedTab: 'login' | 'register'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:selectedTab', value: 'login' | 'register'): void
}>()

const authDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const selectedTab = computed({
  get: () => props.selectedTab,
  set: (value: 'login' | 'register') => emit('update:selectedTab', value),
})

const name = ref('')
const birthDate = ref<Date | null>(null)
const email = ref('')
const password = ref('')
const phone = ref('')
const dni = ref('')
const nationality = ref('')
const focusedField = ref('')
const birthDateMenu = ref(false)

const formattedBirthDate = computed(() => {
  if (birthDate.value) {
    const date = new Date(birthDate.value)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }
  return t('Header_Popup_Auth_Birthday_Text')
})

const handleBirthDate = (val: Date) => {
  birthDate.value = val
  birthDateMenu.value = false
}

const clearForm = () => {
  name.value = ''
  birthDate.value = null
  email.value = ''
  password.value = ''
  phone.value = ''
  dni.value = ''
  nationality.value = ''
}

watch(selectedTab, () => {
  clearForm()
})

watch(authDialog, (val) => {
  if (val) {
    clearForm()
  }
})

const setFocus = (field: string) => {
  focusedField.value = field
}
const removeFocus = () => {
  focusedField.value = ''
}

const handleAuth = async () => {
  let success
  if (selectedTab.value === 'login') {
    success = await storeAuth.login(email.value, password.value)
  } else {
    success = await storeAuth.register(
      name.value,
      birthDate.value,
      email.value,
      password.value,
      phone.value,
      dni.value,
      nationality.value
    )
    if (success) await storeAuth.login(email.value, password.value)
  }
  if (success) {
    authDialog.value = false
    router.push({ name: 'userPrivate', params: { id: storeAuth.getUserId() } })
  }
}
</script>

<template>
  <v-dialog v-model="authDialog" width="500px" :class="['auth-container', { 'auth-container-login': selectedTab === 'login' }]">
    <v-card rounded="xl" :style="{ backgroundColor: backgroundSettings, color: textColor }">
      <div class="auth-titles">
        <span 
          class="auth-title auth-title-login"
          :class="['auth-title', { active: selectedTab === 'login' }]" 
          @click="selectedTab = 'login'"
        >
          {{ t('Header_Popup_Auth_Login') }}
          <div class="auth-underline" v-if="selectedTab === 'login'"></div>
        </span>
        <span 
          class="auth-title auth-title-register" 
          :class="['auth-title', { active: selectedTab === 'register' }]" 
          @click="selectedTab = 'register'"
        >
          {{ t('Header_Popup_Auth_Register') }}
          <div class="auth-underline" v-if="selectedTab === 'register'"></div>
        </span>
      </div>

      <v-btn 
        icon 
        @click="authDialog = false" 
        class="popup-close-btn" 
        :style="{ color: textColor }"
        :ripple="false"
        density="compact"
      >
        <v-icon size="25">mdi-close</v-icon>
      </v-btn>

      <v-card-text class="auth-form" @keyup.enter="handleAuth" tabindex="0">
        <div class="auth-form-text" v-if="selectedTab === 'register'">{{ t('Header_Popup_Auth_Name') }}</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="name"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'name' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Name')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('name')"
          @blur="removeFocus"
        />

        <div class="auth-form-text" v-if="selectedTab === 'register'">{{ t('Header_Popup_Auth_Birthday') }}</div>
        <v-menu
          v-if="selectedTab === 'register'"
          v-model="birthDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ props }">
            <div class="auth-form-calendar">
              <v-btn
                rounded
                v-bind="props"
                class="auth-form-calendar-btn"
              >
                <v-icon>mdi-calendar</v-icon>
                <p class="auth-form-calendar-text">{{ formattedBirthDate }}</p>
              </v-btn>
              <!-- <div class="auth-form-calendar-text">
                {{ formattedBirthDate }}
              </div> -->
            </div>
          </template>
          <v-container>
            <v-row justify="center">
              <v-date-picker 
                v-model="birthDate"
                @update:modelValue="handleBirthDate"
                :style="{ background: backgroundSettings, color: textColor }"
                color="#FF8C00"
                width="400"
              ></v-date-picker>
            </v-row>
          </v-container>
        </v-menu>

        <div class="auth-form-text">{{ t('Header_Popup_Auth_Email') }}</div>
        <v-text-field
          v-model="email"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'email' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Email')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('email')"
          @blur="removeFocus"
        />

        <div class="auth-form-text">{{ t('Header_Popup_Auth_Password') }}</div>
        <v-text-field
          v-model="password"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'password' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Password')"
          type="password"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('password')"
          @blur="removeFocus"
        />

        <div class="auth-form-text" v-if="selectedTab === 'register'">{{ t('Header_Popup_Auth_Phone') }}</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="phone"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'phone' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Phone')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('phone')"
          @blur="removeFocus"
        />

        <div class="auth-form-text" v-if="selectedTab === 'register'">{{ t('Header_Popup_Auth_DNI') }}</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="dni"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'dni' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_DNI')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('dni')"
          @blur="removeFocus"
        />

        <div class="auth-form-text" v-if="selectedTab === 'register'">{{ t('Header_Popup_Auth_Nationality') }}</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="nationality"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'nationality' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Nationality')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('nationality')"
          @blur="removeFocus"
        />
        <v-btn variant="flat" block rounded="lg" class="auth-form-btn" @click="handleAuth">
          {{ selectedTab === 'login' ? t('Header_Popup_Auth_Login') : t('Header_Popup_Auth_Register') }}
        </v-btn>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.auth-container {
  align-items: flex-start !important;
}

.auth-container-login {
  margin-top: 100px !important;
}

.auth-titles {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.auth-title.active {
  color: v-bind(textColor);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-underline {
  margin-top: 2px;
  margin-bottom: 5px;
  width: 30px;
  height: 6px;
  background-color: #FF8C00;
  border-radius: 10px;
}

.auth-title-login,
.auth-title-register {
  cursor: pointer;
  margin: 10px 20px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #808080;
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

.v-btn {
  text-transform: none;
}

.auth-form {
  margin: 0 15px;
}

.auth-form-text {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.auth-form-field {
  color: v-bind(textColor);
}

.auth-form-field:hover {
  color: #FF8C00;
}

::v-deep(.auth-form-field input:focus) {
  box-shadow: 0 0 3px 2px #ff8c0099 !important;
  border-radius: 8px;
}

.auth-form-field-focus {
  color: #FF8C00;
}

.auth-form-btn {
  background-color: #FF8C00;
  padding: 20px 0;
  color: #000000;
  font-size: 0.9rem;
}

.auth-form-btn:hover {
  background-color: #ffd796;
}

.auth-form-calendar {
  display: flex;
  align-items: center;
  margin: 10px 0 15px 0;
}

.auth-form-calendar-btn {
  margin-right: 20px;
  background-color: transparent;
  color: v-bind(textColor);
  box-shadow: none;
  padding: 5px 10px;
}

.auth-form-calendar-btn:hover {
  color: #ff8c0099;
  border: solid 1px #ff8c0099;
  box-shadow: 0 0 3px 2px #ff8c0099 !important;
}

.auth-form-calendar-text {
  margin-left: 8px;
  padding-top: 1px;
}
</style>