import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createI18n } from 'vue-i18n';

import ES from './locales/es.json'
import EN from './locales/en.json'

const messages = {
  ES: ES,
  EN: EN
}

const i18n = createI18n({
  legacy: false,
  locale: 'ES',
  fallbackLocale: 'ES',
  messages
})

const vuetify = createVuetify({
    components,
    directives
  })

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
