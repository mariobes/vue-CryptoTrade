<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import router from '@/router'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)

const storeUserPreferences = useUserPreferencesStore()
const storeAuth = useAuthStore()

const { t } = useI18n()

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

const emailOrPhone = ref('')
const name = ref('')
const birthDate = ref<Date | null>(null)
const email = ref('')
const password = ref('')
const phone = ref('')
const dni = ref('')
const nationality = ref('')
const focusedField = ref('')
const birthDateMenu = ref(false)

const passwordVisible = ref(false)
const showPassword = computed(() => passwordVisible.value ? 'text' : 'password')

const errorMessages = ref<{
  emailOrPhone?: string,
  name?: string,
  birthDate?: string,
  email?: string,
  password?: string,
  phone?: string,
  dni?: string,
  nationality?: string,
  login?: string,
}>({})

const toggleShowPassword = () => {
  passwordVisible.value = !passwordVisible.value
}

const formattedBirthDate = computed(() => {
  if (birthDate.value) {
    const date = new Date(birthDate.value)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }
  return t('Header_Popup_Auth_Birthdate_Text')
})

const handleBirthDate = (val: Date) => {
  birthDate.value = val
  birthDateMenu.value = false
}

const clearForm = () => {
  emailOrPhone.value = ''
  name.value = ''
  birthDate.value = null
  email.value = ''
  password.value = ''
  phone.value = ''
  dni.value = ''
  nationality.value = ''
  errorMessages.value = {}
}

watch(selectedTab, () => {
  clearForm()
})

watch(authDialog, (val) => {
  if (val) {
    clearForm();
    passwordVisible.value = false;
  }
});

const setFocus = (field: string) => {
  focusedField.value = field
}
const removeFocus = () => {
  focusedField.value = ''
}

const handleAuth = async () => {
  if (selectedTab.value === 'login')
  {
    if (!validateFieldsLogin()) return
  } else {
    if (!validateFieldsRegister()) return
  }
  let success
  if (selectedTab.value === 'login') {
    success = await storeAuth.login(emailOrPhone.value, password.value)
    if (!success) {
      errorMessages.value.login = t('Header_Popup_Auth_Login_Error')
    }
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
  return Object.keys(errorMessages.value).length === 0
}

const validateFieldsLogin = () => {
  errorMessages.value = {}

  if (!emailOrPhone.value) errorMessages.value.emailOrPhone = t('Header_Popup_Auth_Field_Required')

  if (!password.value) {
    errorMessages.value.password = t('Header_Popup_Auth_Field_Required')
  } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?{}|<>])[A-Za-z\d!@#$%^&*(),.?{}|<>]{8,}$/.test(password.value)) {
    errorMessages.value.password = t('Header_Popup_Auth_Password_Error')
  }

  return Object.keys(errorMessages.value).length === 0
}

const validateFieldsRegister = () => {
  errorMessages.value = {}

  if (!name.value)  {
    errorMessages.value.name = t('Header_Popup_Auth_Field_Required')
  } else if (name.value.length > 50) {
    errorMessages.value.name = t('Header_Popup_Auth_Name_Error')
  }

  if (!birthDate.value)  {
    errorMessages.value.birthDate = t('Header_Popup_Auth_Field_Required')
  } else if (isUnder18(birthDate.value)) {
    errorMessages.value.birthDate = t('Header_Popup_Auth_BirthDate_Error')
  }

  if (!email.value)  {
    errorMessages.value.email = t('Header_Popup_Auth_Field_Required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMessages.value.email = t('Header_Popup_Auth_Email_Error')
  }

  if (!password.value)  {
    errorMessages.value.password = t('Header_Popup_Auth_Field_Required')
  } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?{}|<>])[A-Za-z\d!@#$%^&*(),.?{}|<>]{8,}$/.test(password.value)) {
    errorMessages.value.password = t('Header_Popup_Auth_Password_Error')
  }

  if (!phone.value) {
    errorMessages.value.phone = t('Header_Popup_Auth_Field_Required')
  } else if (!/^\+?[0-9\s\-().]{7,20}$/.test(phone.value)) {
    errorMessages.value.phone = t('Header_Popup_Auth_Phone_Error')
  }

  if (!dni.value) {
    errorMessages.value.dni = t('Header_Popup_Auth_Field_Required')
  } else if (!/^[\w\s\-\/\.]{4,30}$/.test(dni.value)) {
    errorMessages.value.dni = t('Header_Popup_Auth_DNI_Error')
  }

  if (!nationality.value)  {
    errorMessages.value.nationality = t('Header_Popup_Auth_Field_Required')
  }

  return Object.keys(errorMessages.value).length === 0
}

function isUnder18(birthDate: string | Date): boolean {
  const birth = new Date(birthDate)
  const today = new Date()

  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const dayDiff = today.getDate() - birth.getDate()

  return (
    age < 18 ||
    (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
  )
}
</script>

<template>
  <v-dialog v-model="authDialog" width="500px" :class="['auth-container', { 'auth-container-login': selectedTab === 'login' }]">
    <v-card rounded="xl" :style="{ backgroundColor: backgroundTable, color: textColor }">
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

        <!-- Campo de nombre -->
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
        <span v-if="selectedTab === 'register'" class="auth-form-error">{{ errorMessages.name || '\u00A0' }}</span>

        <!-- Campo de fecha de nacimiento -->
        <div class="auth-form-text" v-if="selectedTab === 'register'">{{ t('Header_Popup_Auth_Birthdate') }}</div>
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
                <span class="auth-form-calendar-text">{{ formattedBirthDate }}</span>
              </v-btn>
            </div>
          </template>
          <v-container>
            <v-row justify="center">
              <v-date-picker 
                v-model="birthDate"
                @update:modelValue="handleBirthDate"
                :style="{ background: backgroundTable, color: textColor }"
                color="var(--primary-color)"
                width="400"
              ></v-date-picker>
            </v-row>
          </v-container>
        </v-menu>
        <span v-if="selectedTab === 'register'" class="auth-form-error">{{ errorMessages.birthDate || '\u00A0' }}</span>

        <!-- Campo de número de teléfono/dirección de correo del login -->
        <div class="auth-form-text" v-if="selectedTab === 'login'">{{ t('Header_Popup_Auth_Email_Phone') }}</div>
        <v-text-field
          v-if="selectedTab === 'login'"
          v-model="emailOrPhone"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'emailOrPhone' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Email_Phone')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('emailOrPhone')"
          @blur="removeFocus"
        />
        <span v-if="selectedTab === 'login'" class="auth-form-error">{{ errorMessages.emailOrPhone || '\u00A0' }}</span>

        <!-- Campo de dirección de correo -->
        <div class="auth-form-text" v-if="selectedTab === 'register'">{{ t('Header_Popup_Auth_Email') }}</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="email"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'email' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Email')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('email')"
          @blur="removeFocus"
        />
        <span v-if="selectedTab === 'register'" class="auth-form-error">{{ errorMessages.email || '\u00A0' }}</span>
        
        <!-- Campo de contraseña -->
        <div class="auth-form-text">{{ t('Header_Popup_Auth_Password') }}</div>
        <v-text-field
          v-model="password"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'password' }"
          :placeholder="t('Header_Popup_Auth_Placeholder_Password')"
          :type="showPassword"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('password')"
          @blur="removeFocus"
        >
          <template v-slot:append>
            <v-icon @click="toggleShowPassword">
              {{ passwordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
            </v-icon>
          </template>
        </v-text-field>
        <span class="auth-form-error">{{ errorMessages.password || '\u00A0' }}</span>

        <!-- Campo de número de teléfono -->
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
        <span v-if="selectedTab === 'register'" class="auth-form-error">{{ errorMessages.phone || '\u00A0' }}</span>

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
        <span v-if="selectedTab === 'register'" class="auth-form-error">{{ errorMessages.dni || '\u00A0' }}</span>

        <!-- Campo de nacionalidad -->
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
        <span v-if="selectedTab === 'register'" class="auth-form-error">{{ errorMessages.nationality || '\u00A0' }}</span>

        <v-btn variant="flat" block rounded="lg" class="auth-form-btn" @click="handleAuth">
          {{ selectedTab === 'login' ? t('Header_Popup_Auth_Login') : t('Header_Popup_Auth_Register') }}
        </v-btn>
        <span v-if="errorMessages.login" class="auth-form-error login-error">{{ errorMessages.login }}</span>

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
  background-color: var(--primary-color);
  border-radius: 10px;
}

.auth-title-login,
.auth-title-register {
  cursor: pointer;
  margin: 10px 20px;
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--gray-color);
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
  padding: 10px 25px 25px 25px !important;
}

.auth-form-text {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.auth-form-field {
  color: v-bind(textColor);
  height: 60px;
}

.auth-form-field:hover {
  color: var(--primary-color);
}

::v-deep(.auth-form-field input:focus) {
  box-shadow: 0 0 3px 2px var(--primary-color-brown-hover) !important;
  border-radius: 8px;
}

.auth-form-field-focus {
  color: var(--primary-color);
}

.auth-form-btn {
  background-color: var(--primary-color);
  padding: 20px 0;
  color: var(--black-color);
  font-size: 0.9rem;
  margin-top: 15px;
}

.auth-form-btn:hover {
  background-color: var(--primary-color-light-hover);
}

.auth-form-calendar {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.auth-form-calendar-btn {
  margin-right: 20px;
  background-color: transparent;
  color: v-bind(textColor);
  box-shadow: none;
  padding: 5px 10px;
}

.auth-form-calendar-btn:hover {
  color: var(--primary-color-brown-hover);
  border: solid 1px var(--primary-color-brown-hover);
  box-shadow: 0 0 3px 2px var(--primary-color-brown-hover) !important;
}

.auth-form-calendar-text {
  margin-left: 8px;
  padding-top: 1px;
}

.auth-form-error {
  color: var(--red-color);
  font-size: 0.7rem;
  font-weight: bold;
  display: flex;
  justify-content: end;
}

.login-error {
  justify-content: start;
  margin-top: 20px;
  font-size: 0.8rem;
}
</style>