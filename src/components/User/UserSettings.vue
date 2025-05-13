<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import type { User } from '@/core/user'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const textColor = computed(() => storeUserPreferences.getTheme().text)
const backgroundTable = computed(() => storeUserPreferences.getTheme().table)

const storeUserPreferences = useUserPreferencesStore()
const storeUsers = useUsersStore()
const storeAuth = useAuthStore()

const { t } = useI18n()
const router = useRouter()

const selectedOption = ref<'login' | 'data'>('login');

const userData = ref<User | null>(null);
const userId = storeAuth.getUserId()
const token = storeAuth.getToken()

const showPassword = ref(false)

const showDeleteModal = ref(false)

const editingField = ref<'email' | 'phone' | 'password' | null>(null)
const tempValues = ref({
  email: '',
  phone: '',
  password: '',
})

const errorMessages = ref<{
  email?: string,
  password?: string,
  phone?: string,
}>({})

const successMessages = ref<{
  email?: string,
  password?: string,
  phone?: string,
}>({})

const loadUserData = async () => {
  if (!storeAuth.isLoggedIn()) return;
  userData.value = await storeUsers.GetUserById(userId, token);
}

onMounted(async () => {
  await loadUserData();
});

watch(userData, (val) => {
  if (val) {
    tempValues.value.email = val.email
    tempValues.value.phone = val.phone
    tempValues.value.password = ''
  }
})

const confirmEdit = async (field: 'email' | 'phone' | 'password') => {
  errorMessages.value[field] = ''
  successMessages.value[field] = ''

  const isValid = validateFields(field)

  if (!isValid) {
    if (userData.value) {
      tempValues.value[field] = field === 'password' 
        ? ''
        : userData.value[field] || ''
    }
    editingField.value = null;
    return;
  }

  const payload: { email?: string; phone?: string; password?: string } = {}

  if (field === 'email' && tempValues.value.email.trim() !== '') {
    payload.email = tempValues.value.email.trim()
  } else if (field === 'phone' && tempValues.value.phone.trim() !== '') {
    payload.phone = tempValues.value.phone.trim()
  } else if (field === 'password' && tempValues.value.password.trim() !== '') {
    payload.password = tempValues.value.password.trim()
  }

  const currentValue = userData.value ? userData.value[field] : null

  await storeUsers.UpdateUser(userId, token, payload.email, payload.password, payload.phone)

  await loadUserData()

  if (field === 'email' && tempValues.value.email.trim() !== currentValue) {
    successMessages.value[field] = t('UserSettings_Field_Updated')
  } else if (field === 'phone' && tempValues.value.phone.trim() !== currentValue) {
    successMessages.value[field] = t('UserSettings_Field_Updated')
  } else if (field === 'password' && tempValues.value.password.trim() !== currentValue) {
    successMessages.value[field] = t('UserSettings_Field_Updated')
  }

  editingField.value = null

  setTimeout(() => {
    successMessages.value[field] = ''
  }, 5000)
}

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {

  await storeUsers.DeleteUser(userId, token);
  storeAuth.logout();
  router.push('/');
}

const validateFields = (field: 'email' | 'phone' | 'password') => {
  errorMessages.value[field] = ''

  const value = tempValues.value[field]

  if (!value) {
    errorMessages.value[field] = t('UserSettings_Field_Required')
    setTimeout(() => {
      errorMessages.value[field] = ''
    }, 5000)
    return false
  }

  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errorMessages.value[field] = t('UserSettings_Email_Error')
    setTimeout(() => {
      errorMessages.value[field] = ''
    }, 5000)
    return false
  }

  if (field === 'password' && !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?{}|<>])[A-Za-z\d!@#$%^&*(),.?{}|<>]{8,}$/.test(value)) {
    errorMessages.value[field] = t('UserSettings_Password_Error')
    setTimeout(() => {
      errorMessages.value[field] = ''
    }, 5000)
    return false
  }

  if (field === 'phone' && !/^\+?[0-9\s\-().]{7,20}$/.test(value)) {
    errorMessages.value[field] = t('UserSettings_Phone_Error')
    setTimeout(() => {
      errorMessages.value[field] = ''
    }, 5000)
    return false
  }

  return true
}

const formatDate = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return ''

  const date = typeof dateInput === 'string'
    ? new Date(dateInput.replace(' ', 'T'))
    : dateInput

  if (isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>

<template>
  <div class="main-container">
    <div class="user-options-content">
      <div class="user-title">{{ t('UserSettings_Details_Account_Title') }}</div>
      <button
          class="user-option-btn"
          :class="{ selected: selectedOption === 'login' }"
          @click="selectedOption = 'login'"
        >
        {{ t('UserSettings_Login_Security_Title') }}
        </button>
        <button
          class="user-option-btn"
          :class="{ selected: selectedOption === 'data' }"
          @click="selectedOption = 'data'"
        >
        {{ t('UserSettings_Personal_Data_Title') }}
        </button>
    </div>

    <div class="user-info-content">
      <div v-if="selectedOption === 'login'">
        <div class="user-title">{{ t('UserSettings_Login_Security_Title') }}</div>
        <div class="login-item">
          <div class="login-item-info">
            <span class="login-item-title">{{ t('UserSettings_Email_Title') }}</span>
            <span class="login-item-text">{{ t('UserSettings_Email_Text') }}</span>
          </div>
          <div class="login-item-value">
            <div class="input-group">
              <input
                type="email"
                v-model="tempValues.email"
                :disabled="editingField !== 'email'"
              />
              <span v-if="errorMessages.email" class="field-error">{{ errorMessages.email }}</span>
              <span v-if="successMessages.email" class="field-success">{{ successMessages.email }}</span>
            </div>
            <button
              :disabled="editingField !== null && editingField !== 'email'"
              @click="editingField === 'email' ? confirmEdit('email') : editingField = 'email'">
              <span :class="editingField === 'email' ? 'mdi mdi-check-circle' : 'mdi mdi-pencil'"></span>
            </button>
          </div>
        </div>

        <div class="login-item">
          <div class="login-item-info">
            <span class="login-item-title">{{ t('UserSettings_Phone_Title') }}</span>
            <span class="login-item-text">{{ t('UserSettings_Phone_Text') }}</span>
          </div>
          <div class="login-item-value">
            <div class="input-group">
              <input
                type="text"
                v-model="tempValues.phone"
                :disabled="editingField !== 'phone'"
              />
              <span v-if="errorMessages.phone" class="field-error">{{ errorMessages.phone }}</span>
              <span v-if="successMessages.phone" class="field-success">{{ successMessages.phone }}</span>
            </div>
            <button
              :disabled="editingField !== null && editingField !== 'phone'"
              @click="editingField === 'phone' ? confirmEdit('phone') : editingField = 'phone'">
              <span :class="editingField === 'phone' ? 'mdi mdi-check-circle' : 'mdi mdi-pencil'"></span>
            </button>
          </div>     
        </div>

        <div class="login-item">
          <div class="login-item-info">
            <span class="login-item-title">{{ t('UserSettings_Password_Title') }}</span>
            <span class="login-item-text">{{ t('UserSettings_Password_Text') }}</span>
          </div>
          <div class="login-item-value login-password">
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="tempValues.password"
                :disabled="editingField !== 'password'"
                placeholder="**************"
              />
              <span v-if="errorMessages.password" class="field-error">{{ errorMessages.password }}</span>
              <span v-if="successMessages.password" class="field-success">{{ successMessages.password }}</span>
            </div>
            <button @click="showPassword = !showPassword">
              <span :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></span>
            </button>
            <button
              :disabled="editingField !== null && editingField !== 'password'"
              @click="editingField === 'password' ? confirmEdit('password') : editingField = 'password'">
              <span :class="editingField === 'password' ? 'mdi mdi-check-circle' : 'mdi mdi-pencil'"></span>
            </button>
          </div>
        </div>

        <div class="login-item">
          <div class="login-item-info">
            <span class="login-item-title">{{ t('UserSettings_Delete_Account_Title') }}</span>
            <span class="login-item-text">{{ t('UserSettings_Delete_Account_Text') }}</span>
          </div>
          <button class="login-item-btn" @click="openDeleteModal">{{ t('UserSettings_Delete_Account_Btn') }}</button>
        </div>
      </div>

      <div v-if="selectedOption === 'data'">
        <div class="user-title">{{ t('UserSettings_Personal_Data_Title') }}</div>
        <div class="login-item">
          <span class="login-item-field">{{ t('UserSettings_Name_Title') }}</span>
          <span class="login-item-value">{{ userData?.name }}</span>
        </div>

        <div class="login-item">
          <span class="login-item-field">{{ t('UserSettings_Birthdate_Title') }}</span>
          <span class="login-item-value">{{ formatDate(userData?.birthdate) }}</span>
        </div>

        <div class="login-item">
          <span class="login-item-field">{{ t('UserSettings_Email_Title') }}</span>
          <span class="login-item-value">{{ userData?.email }}</span>
        </div>

        <div class="login-item">
          <span class="login-item-field">{{ t('UserSettings_Phone_Title') }}</span>
          <span class="login-item-value">{{ userData?.phone }}</span>
        </div>

        <div class="login-item">
          <span class="login-item-field">{{ t('UserSettings_DNI_Title') }}</span>
          <span class="login-item-value">{{ userData?.dni }}</span>
        </div>

        <div class="login-item">
          <span class="login-item-field">{{ t('UserSettings_Nationality_Title') }}</span>
          <span class="login-item-value">{{ userData?.nationality }}</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showDeleteModal" class="popup-delete-container">
  <div class="popup-delete-content">
    <span class="popup-delete-title">{{ t('UserSettings_Popup_Delete_Account_Title') }}</span>
    <p>{{ t('UserSettings_Popup_Delete_Account_Text') }}</p>
    <div class="popup-delete-btn">
      <button @click="confirmDelete" class="delete-confirm-btn">
        {{ t('UserSettings_Popup_Delete_Account_Btn') }}
      </button>
      <button @click="showDeleteModal = false" class="delete-cancel-btn" :class="[ storeUserPreferences.selectedTheme === 'light' ? 'delete-cancel-btn-light' : 'delete-cancel-btn-dark' ]">
        {{ t('UserSettings_Popup_Cancel_Btn') }}
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
.main-container {
  color: v-bind(textColor);
  display: flex;
}

.user-options-content {
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.user-option-btn {
  font-size: 1.2rem;
  margin-right: 30px;
  color: var(--gray-color);
  display: flex;
  padding-left: 15px;
  border-left: 3px solid transparent;
  font-size: 1rem;
}

.user-option-btn:hover {
  border-left: solid 3px var(--gray-color);
}

.selected {
  border-left: solid 3px var(--primary-color);
  color: v-bind(textColor);
}

.user-info-content {
  width: 70%;
  display: flex;
  flex-direction: column;
  border-left: solid 1px var(--dark-gray-color);
  padding-left: 80px;
}

.login-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-item:not(:last-child) {
  border-bottom: solid 1px var(--dark-gray-color);
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.login-item-info {
  display: flex;
  flex-direction: column;
}

.login-item-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.login-item-text {
  font-size: 0.9;
  color: var(--gray-color);
}

.login-item-value {
  font-weight: bold;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.login-item-btn {
  background-color: var(--red-color);
  border-radius: 10px;
  padding: 10px 15px;
  color: v-bind(textColor);
  font-weight: bold;
  font-size: 0.95rem;
}

.login-item-btn:hover {
  background-color: var(--red-color-hover);
}

.login-item-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-item-value input {
  border: none;
  border-bottom: 1px solid var(--white-color);
  padding: 5px;
  font-weight: bold;
  background: transparent;
  color: inherit;
  width: 200px;
}

.login-password input {
  width: 170px;
}

.login-item-value input:disabled {
  border-bottom: none;
  color: var(--gray-color);
  background: transparent;
}

.login-item-value button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray-color);
  font-size: 1.2rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-item-field {
  color: var(--gray-color);
  font-weight: bold;
}

.popup-delete-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-delete-content {
  background: v-bind(backgroundTable);
  color: v-bind(textColor);
  padding: 30px;
  border-radius: 15px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.popup-delete-title {
  font-size: 1.6rem;
  font-weight: bold;
}

.popup-delete-btn {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.delete-confirm-btn {
  background-color: var(--red-color);
  color: v-bind(textColor);
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 8px;
}

.delete-confirm-btn:hover {
  background-color: var(--red-color-hover);
}

.delete-cancel-btn {
  background-color: var(--white-color);
  color: var(--black-color);
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 8px;
}

.delete-cancel-btn-light:hover {
  background-color: var(--dark-gray-color);
}

.delete-cancel-btn-dark:hover {
  background-color: var(--white-color-hover);
}

.field-error {
  color: var(--red-color);
  font-size: 0.85rem;
  margin-top: 5px;
}

.field-success {
  color: var(--green-color);
  font-size: 0.85rem;
  margin-top: 5px;
}

/* Responsive */
@media (max-width: 1700px) {
  .main-container {
    width: 70vw;
  }
}

@media (max-width: 1400px) {
  .main-container {
    width: 90vw;
  }

  .user-options-content {
    display: none;
  }

  .user-info-content {
    width: 70%;
    border-left: none;
  }
}

@media (max-width: 1000px) {
  .main-container {
    width: 100vw;
    margin: 0;
  }

  .user-info-content {
    padding: 0;
  }

  .login-item-text {
    display: none;
  }
}
</style>
