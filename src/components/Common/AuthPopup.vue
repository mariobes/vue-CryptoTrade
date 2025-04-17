<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserPreferencesStore } from '@/stores/userPreferences'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundSettings = computed(() => storeUserPreferences.getTheme().settings)

const { t } = useI18n()
const router = useRouter()

const storeUserPreferences = useUserPreferencesStore()

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
  return 'Selecciona fecha'
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

      <v-btn icon @click="authDialog = false" class="popup-close-btn" :style="{ color: textColor }">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-text class="auth-form">
        <div class="auth-form-text" v-if="selectedTab === 'register'">Nombre</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="name"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'name' }"
          :placeholder="t('Ingresa tu nombre')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('name')"
          @blur="removeFocus"
        />

        <!-- <div class="auth-form-text" v-if="selectedTab === 'register'">Fecha de nacimiento</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="birthDate"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'birthDate' }"
          :placeholder="t('Ingresa tu fecha de nacimiento')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('birthDate')"
          @blur="removeFocus"
        /> -->

        <div class="auth-form-text" v-if="selectedTab === 'register'">Fecha de nacimiento</div>
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
                icon
                v-bind="props"
                class="auth-form-calendar-icon"
              >
                <v-icon>mdi-calendar</v-icon>
              </v-btn>
              <div class="auth-form-calendar-text">
                {{ formattedBirthDate }}
              </div>
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
<!-- 
        v-model="birthDate"
        @update:modelValue="birthDateMenu = false"
        width="400"
        color="orange-darken-2"
        show-adjacent-months 
        -->

        <div class="auth-form-text">Dirección de correo electrónico</div>
        <v-text-field
          v-model="email"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'email' }"
          :placeholder="t('Ingresa tu dirección de correo electrónico')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('email')"
          @blur="removeFocus"
        />

        <div class="auth-form-text">Contraseña</div>
        <v-text-field
          v-model="password"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'password' }"
          :placeholder="t('Ingresa tu contraseña')"
          type="password"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('password')"
          @blur="removeFocus"
        />

        <div class="auth-form-text" v-if="selectedTab === 'register'">Télefono</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="phone"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'phone' }"
          :placeholder="t('Ingresa tu número de teléfono')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('phone')"
          @blur="removeFocus"
        />

        <div class="auth-form-text" v-if="selectedTab === 'register'">DNI</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="dni"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'dni' }"
          :placeholder="t('Ingresa tu DNI')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('dni')"
          @blur="removeFocus"
        />

        <div class="auth-form-text" v-if="selectedTab === 'register'">Nacionalidad</div>
        <v-text-field
          v-if="selectedTab === 'register'"
          v-model="nationality"
          class="auth-form-field"
          :class="{ 'auth-form-field-focus': focusedField === 'nationality' }"
          :placeholder="t('Ingresa tu lugar de nacimiento')"
          variant="outlined"
          rounded="lg"
          @focus="setFocus('nationality')"
          @blur="removeFocus"
        />
        <v-btn variant="flat" block rounded="lg" class="auth-form-btn">
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
  top: 10px;
  right: 10px;
  background-color: transparent;
  box-shadow: none;
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

.auth-form-calendar-icon {
  margin-right: 20px;
  background-color: transparent;
  color: v-bind(textColor);
  box-shadow: none;
}

.auth-form-calendar-icon:hover {
  color: #ff8c0099;
  border: solid 1px #ff8c0099;
  box-shadow: 0 0 3px 2px #ff8c0099 !important;
}

.auth-form-calendar-text {
  font-weight: bold;
  color: v-bind(textColor);
}
</style>